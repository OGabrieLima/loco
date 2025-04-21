import 'videojs-errors'
import './player.css'
import 'video.js/dist/video-js.css'

// import Head from 'next/head';
// import { styled } from 'twin.macro';
import { Box } from '@chakra-ui/core'
import {
  Quality,
  registerIVSQualityPlugin,
  registerIVSTech,
  VideoJSEvents,
  VideoJSIVSTech,
  VideoJSQualityPlugin,
} from 'amazon-ivs-player'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import videojs, { VideoJsPlayer } from 'video.js'
// import { registerIVSTech, registerIVSQualityPlugin } from 'amazon-ivs-player';
// import { useStreamStore } from '@stores/streamStore';

// 디폴트 playback url
export interface IVSPlayerProps {
  /** IVS Playback URL */
  src?: string
  rewindurl: string
  poster: string
  streamTitle: string
  streamDescription: string
  createdAt: number
  liveStream: boolean
  /** quiz 메타데이터가 도달하면 이를 핸들링하는 함수 */
}

// if (!videojs.getPlugin('hotkeys')) {
//   // @ts-ignore
//   videojs.registerPlugin('hotkeys', hotkeys)
// }

function IVSPlayer({
  src,
  rewindurl,
  poster,
  streamTitle,
  streamDescription,
  createdAt,
  liveStream,
}: IVSPlayerProps) {
  const currentQualityRef = useRef<Quality | null>()
  const playerRef = useRef<VideoJsPlayer | null>(null)
  //   const handleIsPlay = useStreamStore(state => state.setIsPlaying);

  const overlayContent = `<div class="vjs-container"><div class="vjs-title">${streamTitle}</div><div class="vjs-desc">${streamDescription}</div></div>`

  const qualitySelectionCssFixFun = () => {
    const qualitiesNodeList = document.querySelectorAll(
      '.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button .vjs-menu .vjs-menu-content .vjs-menu-item.vjs-selected'
    )
    if (qualitiesNodeList.length) {
      qualitiesNodeList.forEach((node) => {
        if (
          //@ts-ignore
          node?.firstChild?.innerText === currentQualityRef.current?.name
        ) {
          node.classList.add('vjs-selected')
        } else {
          node.classList.remove('vjs-selected')
        }
      })
    }
  }

  const fullScreenPositionToLast = () => {
    const controlBarEle = document.getElementsByClassName('vjs-control-bar')[0]
    const fullScreenButtonEle = document.getElementsByClassName(
      'vjs-fullscreen-control'
    )[0]
    if (fullScreenButtonEle) {
      controlBarEle.removeChild(fullScreenButtonEle)
      controlBarEle.appendChild(fullScreenButtonEle)
    }
  }

  const seekBarClicked = useRef(false)
  const bufferingStartTime = useRef(0)
  const seekBackTime = useRef(0)
  const seekBackTimeLocation = useRef(0)
  const rewindUrlLoaded = useRef(false)
  const mouseOverSeekBarClicked = useRef(false)
  const srcToRewindFirstTimeSwitch = useRef(false)
  const playerSrcSwitch = useRef(false)
  const streamStartedTime = useRef(createdAt)
  const playerLiveVideoSource = useRef(src)
  const playerRewindVideoSource = useRef(rewindurl)
  const timeIntervalIdRef = useRef<any>(0)
  const qualityChangeSeekBack = useRef(false)
  const { t, i18n } = useTranslation()
  // const playerTapTouch = useRef<any>('');
  // const playerTapLocation = useRef(0);
  // const timeoutIntervalRef = useRef<any>();

  const findDurationInSec = (from: number, to: number) => {
    const secDiff = (to - from) / 1000
    return secDiff
  }

  const findStreamDuration = (from: number, to: number) => {
    const streamDurationInSeconds = findDurationInSec(from, to)
    const streamDurationFormat =
      streamDurationInSeconds < 3600
        ? new Date(streamDurationInSeconds * 1000).toISOString().substr(14, 5)
        : new Date(streamDurationInSeconds * 1000).toISOString().substr(11, 8)
    return streamDurationFormat
  }

  const resetRefs = () => {
    seekBarClicked.current = false
    seekBackTime.current = 0
    rewindUrlLoaded.current = false
    mouseOverSeekBarClicked.current = false
    srcToRewindFirstTimeSwitch.current = false
    playerSrcSwitch.current = false
  }

  const setSeekBackTime = (sliderValue: number) => {
    const currentTime = new Date().getTime()
    const pastTime = findDurationInSec(
      streamStartedTime.current,
      bufferingStartTime.current
    )
    const bufferTime = findDurationInSec(
      bufferingStartTime.current,
      currentTime
    )
    const seekRatio = (pastTime + bufferTime) / 100
    const pastTimeRatio = (pastTime / (pastTime + bufferTime)) * 100
    if (sliderValue <= pastTimeRatio) {
      const seekTime = seekRatio * -1 * (pastTimeRatio - sliderValue)
      seekBackTime.current = seekTime
    } else {
      const seekTime = (sliderValue - pastTimeRatio) * seekRatio
      seekBackTime.current = seekTime
    }
  }

  useEffect(() => {
    streamStartedTime.current = createdAt
    playerLiveVideoSource.current = src
    playerRewindVideoSource.current = rewindurl
    bufferingStartTime.current = new Date().getTime()
    const handleIncludeCredsOnSrc = (src?: string | null) => {
      try {
        const player = (playerRef.current as unknown) as videojs.Player &
          VideoJSIVSTech &
          VideoJSQualityPlugin
        if (!player) return
        const ivsPlayer = player.getIVSPlayer()
        const isIVS_LLStream = (src || '').indexOf('loco_player_version=2') >= 0
        if (isIVS_LLStream) {
          ivsPlayer.setRequestCredentials('omit')
        } else {
          ivsPlayer.setRequestCredentials('include')
        }
      } catch (err) {
        // Do Nothing
      }
    }

    if (!playerRef.current) {
      // 로드할 source stream 을 지정합니다. Prop 으로 받은 src 로 설정하거나 존재하지 않으면 기본 url 로 설정합니다(필수 아님).
      const PLAYBACK_URL = src
      registerIVSTech(videojs, {
        wasmWorker: '/static/js/ivs-player/amazon-ivs-wasmworker.min.js',
        wasmBinary: '/static/js/ivs-player/amazon-ivs-wasmworker.min.wasm',
      })
      // IVS 에서는 스트리밍 품질을 선택할 수 있는 플러그인을 제공해줍니다.
      // IVS 에서 제공하는 UI 플러그인을 사용하려면 이를 등록해주어야 합니다.
      registerIVSQualityPlugin(videojs)

      /**
       * 플레이어를 초기화하고 instantiate 합니다.
       */
      const player = videojs(
        // 플레이어에 연동될 video 태그의 id
        'amazon-ivs-videojs',
        // 플레이어 옵션
        {
          techOrder: ['AmazonIVS'], // 플레이어 인스턴스를 생성할 때, IVS 를 첫 번째 테크로 제공해주어야 합니다.
          autoplay: true,
          muted: false,
          controlBar: {
            // Hides the replay button for VOD
            pictureInPictureToggle: false, // Hides the PiP button
            playToggle: liveStream ? false : true,
            fullscreenToggle: false,
          },
        },

        // video.js ready 이벤트 핸들러 추가
        () => {
          // playback url 을 src 로 설정합니다. autoplay 가 옵션으로 주어진다면 바로 play 됩니다.
          player.enableIVSQualityPlugin()
          // player.poster(poster)
          handleIncludeCredsOnSrc(PLAYBACK_URL)
          player.src(PLAYBACK_URL!)
          const ivsPl = player.getIVSPlayer()
          ivsPl.setInitialBufferDuration(5) // max is 5 second
        }
      ) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin
      playerRef.current = player
      const videoPlayerEle = document.getElementById('amazon-ivs-videojs')

      const is_ios = /Mac/i.test(navigator.userAgent)
      const is_touchscreen = window.innerWidth < 1380 ? true : false
      const is_iosTouchscreen = is_ios && is_touchscreen

      //adding title and description overlay
      const titleOverlay = document.createElement('div')
      titleOverlay.className = 'vjs-overlay'
      titleOverlay.innerHTML = overlayContent
      videoPlayerEle!.appendChild(titleOverlay)

      //adding forward-backward button overlay while seeking through buttons
      // const seekButtonOverlayContent = `
      //  <div class="seek-button-overlay" id="seek-backward-overlay">
      //    <img src="/static/images/player/seekButton.svg" alt="seek-backward" class="seek-overlay-img seek-overlay-backward-img"/>
      //  </div>
      //  <div class="seek-button-overlay" id="seek-forward-overlay">
      //    <img src="/static/images/player/seekButton.svg" alt="seek-backward" class="seek-overlay-img"/>
      //  </div>
      //  `;
      // const seekButtonOverlay = document.createElement('div');
      // seekButtonOverlay.className = 'vjs-seek-overlay';
      // seekButtonOverlay.innerHTML = seekButtonOverlayContent;
      // videoPlayerEle!.appendChild(seekButtonOverlay);

      // const seekButtonBackwardOverlayEle = document.getElementById(
      //   'seek-backward-overlay'
      // );
      // const seekButtonForwardOverlayEle = document.getElementById(
      //   'seek-forward-overlay'
      // );

      // const controlBarEle = document.getElementsByClassName(
      //   'vjs-control-bar'
      // )[0];
      // const seekButtonHtml = `
      //  <button id="seek-backward">
      //    <img src="/static/images/player/seekButton.svg" alt="seek-backward" id="seek-backward-img"/>
      //  </button>
      //  <button id="seek-forward">
      //    <img src="/static/images/player/seekButton.svg" alt="seek-forward" id="seek-forward-img"/>
      //  </button>`;

      // const seekButton = document.createElement('div');
      // seekButton.className = 'vjs-custom-seek-button';
      // seekButton.innerHTML = seekButtonHtml;
      // controlBarEle.insertBefore(
      //   seekButton,
      //   //@ts-ignore
      //   controlBarEle.firstElementChild?.nextSibling
      // );

      // const seekBackwardButton = document.getElementById('seek-backward');
      // const seekForwardButton = document.getElementById('seek-forward');

      // if (!liveStream) seekButton!.style.display = 'none';

      //adding a custom seekbar
      const seekBarHtml = `
           <input id="seekbar-range" type="range" min="0" max="100" value="100" />
           <span id="current-duration-value">00:00:00</span>
           <div id="current-duration-pointer"></div>
       `
      const seekBar = document.createElement('div')
      seekBar.className = 'vjs-custom-seek-bar'
      seekBar.innerHTML = seekBarHtml
      const parent = document.getElementsByClassName(
        'vjs-live-control vjs-control'
      )[0]
      //@ts-ignore
      parent.insertBefore(seekBar, parent.firstElementChild?.nextSibling)

      const seekBarRangeEle = document.getElementById('seekbar-range')
      //@ts-ignore
      seekBarRangeEle!.disabled = is_iosTouchscreen ? true : false

      const liveButtonEle = document.getElementsByClassName(
        'vjs-live-display'
      )[0]
      liveButtonEle.innerHTML = `<div class="live-text"><div class="bold-bullet"></div>${t(
        'common.live_tag_text'
      )}</div>`

      const currentDurationValue = document.getElementById(
        'current-duration-value'
      )
      const currentDurationPointer = document.getElementById(
        'current-duration-pointer'
      )

      // 위에서 등록한 플러그인을 enable 시켜주어야 UI 버튼들이 나타납니다.

      //@ts-ignore

      /**
       * 이벤트 리스너를 추가해줍니다
       * video.js 외의 IVS Player 에서 발생하는 event 는 다음과 같이 추가하고 제거할 수 있습니다.
       */
      const events: VideoJSEvents = player.getIVSEvents()
      const ivsPlayer = player.getIVSPlayer()
      // ivsPlayer.setQuality()
      ivsPlayer.addEventListener(events.PlayerState.READY, () => {
        if (currentQualityRef.current) {
          ivsPlayer.setQuality(currentQualityRef.current, true)
        } else {
          const qualities = ivsPlayer.getQualities()
          const quality = ivsPlayer.getQuality()
          const filterQualities = qualities.filter((quality) => {
            return quality.name === '720p'
          })
          if (filterQualities.length === 1) {
            ivsPlayer.setAutoMaxQuality(filterQualities[0])
            currentQualityRef.current = quality
            qualitySelectionCssFixFun()
          }
        }
      })

      // const backwardButtonOnClick = () => {
      //   if (!liveStream) return;
      //   ();
      //   seekButtonBackwardOverlayEle!.style.display = 'flex';
      //   timeoutIntervalRef.current = setTimeout(() => {
      //     seekButtonBackwardOverlayEle!.style.display = 'none';
      //     clearTimeout(timeoutIntervalRef.current);
      //   }, 500);
      //   if (rewindUrlLoaded.current) {
      //     const currentTime = new Date().getTime();
      //     const streamTotalLength = findDurationInSec(
      //       streamStartedTime.current,
      //       currentTime
      //     );
      //     seekBackTimeLocation.current = seekBackTimeLocation.current - 10;
      //     const seekFromTheStart =
      //       findDurationInSec(
      //         streamStartedTime.current,
      //         bufferingStartTime.current
      //       ) + seekBackTimeLocation.current;
      //     const seekBarRangeValue = Math.floor(
      //       (seekFromTheStart / streamTotalLength) * 100
      //     );
      //     seekBarRangeEle!.style.backgroundSize = seekBarRangeValue + '% 100%';
      //     //@ts-ignore
      //     seekBarRangeEle.value = seekBarRangeValue;
      //     ivsPlayer.seekTo(seekBackTimeLocation.current);
      //   } else {
      //     player.src(playerRewindVideoSource.current);
      //     player.play();
      //     rewindUrlLoaded.current = true;
      //     srcToRewindFirstTimeSwitch.current = true;
      //     playerSrcSwitch.current = true;
      //     const currentTime = new Date().getTime();
      //     const bufferingTime = findDurationInSec(
      //       bufferingStartTime.current,
      //       currentTime
      //     );
      //     const seekingBackwardTime = bufferingTime - 10;

      //     const streamTotalLength = findDurationInSec(
      //       streamStartedTime.current,
      //       currentTime
      //     );
      //     const seekFromTheStart =
      //       findDurationInSec(
      //         streamStartedTime.current,
      //         bufferingStartTime.current
      //       ) + seekingBackwardTime;
      //     const seekBarRangeValue = Math.floor(
      //       (seekFromTheStart / streamTotalLength) * 100
      //     );
      //     seekBarRangeEle!.style.backgroundSize = seekBarRangeValue + '% 100%';
      //     //@ts-ignore
      //     seekBarRangeEle.value = seekBarRangeValue;

      //     seekBackTime.current = seekingBackwardTime;
      //     liveButtonEle.innerHTML =
      //       '<div class="live-text go-live">GO LIVE</div>';
      //   }
      //   clearInterval(timeIntervalIdRef.current);
      //   timeIntervalIdRef.current = setInterval(() => {
      //     seekBackTimeLocation.current = seekBackTimeLocation.current + 1;
      //   }, 1000);
      // };

      // const forwardButtonOnClick = () => {
      //   if (!liveStream || !rewindUrlLoaded.current) return;
      //   ();
      //   clearInterval(timeIntervalIdRef.current);
      //   seekBackTimeLocation.current = seekBackTimeLocation.current + 10;
      //   const currentTime = new Date().getTime();
      //   const bufferingTime = findDurationInSec(
      //     bufferingStartTime.current,
      //     currentTime
      //   );
      //   seekButtonForwardOverlayEle!.style.display = 'flex';
      //   timeoutIntervalRef.current = setTimeout(() => {
      //     seekButtonForwardOverlayEle!.style.display = 'none';
      //     clearTimeout(timeoutIntervalRef.current);
      //   }, 500);
      //   if (bufferingTime < seekBackTimeLocation.current) {
      //     player.src(playerLiveVideoSource.current!);
      //     player.play();
      //     resetRefs();
      //     rewindUrlLoaded.current = false;
      //     playerSrcSwitch.current = true;
      //     seekBarRangeEle!.style.backgroundSize = '100% 100%';
      //     liveButtonEle.innerHTML =
      //       '<div class="live-text"><div class="bold-bullet"></div>LIVE</div>';
      //     seekBarRangeEle!.style.backgroundSize = '100% 100%';
      //     //@ts-ignore
      //     seekBarRangeEle.value = 100;
      //   } else {
      //     const streamTotalLength = findDurationInSec(
      //       streamStartedTime.current,
      //       currentTime
      //     );
      //     const seekFromTheStart =
      //       findDurationInSec(
      //         streamStartedTime.current,
      //         bufferingStartTime.current
      //       ) + seekBackTimeLocation.current;
      //     const seekBarRangeValue = Math.floor(
      //       (seekFromTheStart / streamTotalLength) * 100
      //     );
      //     seekBarRangeEle!.style.backgroundSize = seekBarRangeValue + '% 100%';
      //     //@ts-ignore
      //     seekBarRangeEle.value = seekBarRangeValue;
      //     ivsPlayer.seekTo(seekBackTimeLocation.current);
      //     clearInterval(timeIntervalIdRef.current);
      //     timeIntervalIdRef.current = setInterval(() => {
      //       seekBackTimeLocation.current = seekBackTimeLocation.current + 1;
      //     }, 1000);
      //   }
      // };

      // seekBackwardButton?.addEventListener('click', backwardButtonOnClick);

      // seekForwardButton?.addEventListener('click', forwardButtonOnClick);

      liveButtonEle?.addEventListener('click', () => {
        if (!liveStream) {
          return
        }
        //@ts-ignore
        if (parseInt(seekBarRangeEle.value) < 100) {
          handleIncludeCredsOnSrc(playerLiveVideoSource.current)
          player.src(playerLiveVideoSource.current!)
          player.play()
          resetRefs()
          rewindUrlLoaded.current = false
          playerSrcSwitch.current = true
          seekBarRangeEle!.style.backgroundSize = '100% 100%'
        }
        //@ts-ignore
        seekBarRangeEle.value = 100
        liveButtonEle.innerHTML = `<div class="live-text"><div class="bold-bullet"></div>${t(
          'common.live_tag_text'
        )}</div>`
      })

      seekBarRangeEle!.addEventListener('input', function() {
        //@ts-ignore
        if (!liveStream || is_iosTouchscreen) {
          return
        }
        //@ts-ignore
        const sliderValue = parseInt(seekBarRangeEle.value)
        seekBarRangeEle!.style.backgroundSize = sliderValue + '% 100%'
        setSeekBackTime(sliderValue)
        const streamDurationFormat = findStreamDuration(
          streamStartedTime.current,
          bufferingStartTime.current + seekBackTime.current * 1000
        )
        currentDurationValue!.innerText = streamDurationFormat
        seekBarClicked.current = true
        if (sliderValue < 100) {
          liveButtonEle.innerHTML =
            '<div class="live-text go-live">GO LIVE</div>'
        } else {
          liveButtonEle.innerHTML = `<div class="live-text"><div class="bold-bullet"></div>${t(
            'common.live_tag_text'
          )}</div>`
        }
        if (!mouseOverSeekBarClicked.current) {
          ivsPlayer.seekTo(seekBackTime.current)
          const seekBarWidth = seekBarRangeEle?.offsetWidth ?? 0
          currentDurationValue!.style.display = 'block'
          currentDurationValue!.style.right =
            ((seekBarWidth / 100) * (100 - sliderValue) - 20).toString() + 'px'
        }
      })

      seekBarRangeEle?.addEventListener('mousemove', function(event) {
        if (!liveStream) return
        currentDurationValue!.style.display = 'block'
        const seekBarWidth = seekBarRangeEle?.offsetWidth ?? 0
        currentDurationValue!.style.right =
          (seekBarWidth - event.offsetX - 20).toString() + 'px'
        currentDurationPointer!.style.right =
          (seekBarWidth - event.offsetX).toString() + 'px'
        if (!mouseOverSeekBarClicked.current) {
          const sliderValueOnHover = (event.offsetX / seekBarWidth) * 100
          setSeekBackTime(sliderValueOnHover < 0 ? 0 : sliderValueOnHover)
          const streamDurationFormat = findStreamDuration(
            streamStartedTime.current,
            bufferingStartTime.current + seekBackTime.current * 1000
          )
          currentDurationValue!.innerText = streamDurationFormat
          //@ts-ignore
          const sliderValue = parseInt(seekBarRangeEle.value)
          //to hide the currentDurationPointer when near the slider thumb
          if (
            sliderValueOnHover < sliderValue + 2 &&
            sliderValueOnHover > sliderValue - 2
          ) {
            currentDurationPointer!.style.display = 'none'
          } else {
            currentDurationPointer!.style.display = 'block'
          }
        }
      })

      seekBarRangeEle?.addEventListener('mousedown', function() {
        if (!liveStream) return
        mouseOverSeekBarClicked.current = true
      })

      seekBarRangeEle?.addEventListener('mouseout', function() {
        if (!liveStream) return
        currentDurationValue!.style.display = 'none'
        currentDurationPointer!.style.display = 'none'
      })

      seekBarRangeEle!.addEventListener('mouseup', function() {
        if (!liveStream) {
          return
        }
        if (seekBarClicked.current) {
          //@ts-ignore
          if (parseInt(seekBarRangeEle.value) < 100) {
            if (!rewindUrlLoaded.current) {
              handleIncludeCredsOnSrc(playerRewindVideoSource.current)
              player.src(playerRewindVideoSource.current)
              player.play()
              rewindUrlLoaded.current = true
              srcToRewindFirstTimeSwitch.current = true
              playerSrcSwitch.current = true
              clearInterval(timeIntervalIdRef.current)
              timeIntervalIdRef.current = setInterval(() => {
                seekBackTimeLocation.current = seekBackTimeLocation.current + 1
              }, 1000)
            }
            if (!playerSrcSwitch.current) {
              ivsPlayer.seekTo(seekBackTime.current)
              seekBackTimeLocation.current = seekBackTime.current
              clearInterval(timeIntervalIdRef.current)
              timeIntervalIdRef.current = setInterval(() => {
                seekBackTimeLocation.current = seekBackTimeLocation.current + 1
              }, 1000)
            }
          } else {
            if (rewindUrlLoaded.current) {
              handleIncludeCredsOnSrc(playerLiveVideoSource.current)
              player.src(playerLiveVideoSource.current!)
              player.play()
              resetRefs()
              rewindUrlLoaded.current = false
              playerSrcSwitch.current = true
            }
          }
        }
        seekBarClicked.current = false
        mouseOverSeekBarClicked.current = false
        currentDurationPointer!.style.display = 'none'
      })

      seekBarRangeEle?.addEventListener('touchstart', function() {
        if (!liveStream || is_iosTouchscreen) return
        mouseOverSeekBarClicked.current = true
      })

      seekBarRangeEle?.addEventListener('touchmove', function(event) {
        if (!liveStream || is_iosTouchscreen) return
        currentDurationValue!.style.display = 'block'
        const seekBarWidth = seekBarRangeEle?.offsetWidth ?? 0
        const seekBarOffsetLeft = seekBarRangeEle.getBoundingClientRect().left
        currentDurationValue!.style.right =
          (
            seekBarWidth +
            seekBarOffsetLeft -
            event.targetTouches[0].clientX -
            20
          ).toString() + 'px'
      })

      seekBarRangeEle!.addEventListener('touchend', function() {
        if (!liveStream || is_iosTouchscreen) {
          return
        }
        mouseOverSeekBarClicked.current = false
        if (seekBarClicked.current) {
          //@ts-ignore
          if (parseInt(seekBarRangeEle.value) < 100) {
            if (!rewindUrlLoaded.current) {
              handleIncludeCredsOnSrc(playerRewindVideoSource.current)
              player.src(playerRewindVideoSource.current)
              player.play()
              rewindUrlLoaded.current = true
              srcToRewindFirstTimeSwitch.current = true
              playerSrcSwitch.current = true
            }
            if (!playerSrcSwitch.current) {
              ivsPlayer.seekTo(seekBackTime.current)
              seekBackTimeLocation.current = seekBackTime.current
            }
          } else {
            if (rewindUrlLoaded.current) {
              handleIncludeCredsOnSrc(playerLiveVideoSource.current)
              player.src(playerLiveVideoSource.current!)
              player.play()
              resetRefs()
              rewindUrlLoaded.current = false
              playerSrcSwitch.current = true
            }
          }
        }
        seekBarClicked.current = false
        currentDurationValue!.style.display = 'none'
      })

      // PLAYING 이벤트 핸들러 추가
      ivsPlayer.addEventListener(events.PlayerState.PLAYING, () => {
        // handleIsPlay(true);
        qualitySelectionCssFixFun()
        fullScreenPositionToLast()
        if (liveStream) {
          if (playerSrcSwitch.current) {
            const oldBufferingStartTime = bufferingStartTime.current
            bufferingStartTime.current = new Date().getTime()
            const bufferingTimeDiff = findDurationInSec(
              oldBufferingStartTime,
              bufferingStartTime.current
            )
            seekBackTime.current = seekBackTime.current - bufferingTimeDiff
            if (srcToRewindFirstTimeSwitch.current) {
              ivsPlayer.seekTo(seekBackTime.current)
              srcToRewindFirstTimeSwitch.current = false
            }
            playerSrcSwitch.current = false
            seekBackTimeLocation.current = seekBackTime.current
            clearInterval(timeIntervalIdRef.current)
            timeIntervalIdRef.current = setInterval(() => {
              seekBackTimeLocation.current = seekBackTimeLocation.current + 1
            }, 1000)
          } else {
            if (qualityChangeSeekBack.current) {
              ivsPlayer.seekTo(seekBackTimeLocation.current)
              clearInterval(timeIntervalIdRef.current)
              timeIntervalIdRef.current = setInterval(() => {
                seekBackTimeLocation.current = seekBackTimeLocation.current + 1
              }, 1000)
              qualityChangeSeekBack.current = false
            }
          }
        }
      })

      //   ivsPlayer.addEventListener(events.PlayerState.IDLE, () => {
      //     // handleIsPlay(false);
      //   });

      // ivsPlayer.addEventListener(events.PlayerEventType.SEEK_COMPLETED, () => {
      //   if (!liveStream) {
      //   }
      // });

      // use this to test it
      ivsPlayer.addEventListener(
        events.PlayerEventType.QUALITY_CHANGED,
        (value) => {
          document
            .querySelectorAll(
              '.vjs-icon-hd.vjs-icon-placeholder.vjs-menu-button.vjs-menu-button-popup.vjs-button'
            )[0]
            //@ts-ignore
            .getElementsByClassName('vjs-icon-placeholder')[0].innerText =
            value.name
          currentQualityRef.current = value
          if (rewindUrlLoaded.current && !playerSrcSwitch.current) {
            qualityChangeSeekBack.current = true
            clearInterval(timeIntervalIdRef.current)
          }
        }
      )

      // BUFFERING 이벤트 핸들러 추가
      // ivsPlayer.addEventListener(events.PlayerState.BUFFERING, () => {
      //   console.log('IVS Player is BUFFERING')
      // })

      // ivsPlayer.addEventListener(
      //   events.PlayerEventType.SEEK_COMPLETED,
      //   (value) => {
      //     console.log('SEEKED TO ', value)
      //   }
      // )

      // ENDED 이벤트 핸들러 추가
      // ivsPlayer.addEventListener(events.PlayerState.ENDED, () => {
      //   console.log('IVS Player is ENDED')
      // })

      // Timed metadata 를 수신하였을 때 이를 핸들링하는 이벤트 핸들러 추가

      /**
       * 에러 핸들러를 추가해줍니다.
       */
      // video.js 에러 핸들러 추가
      // player.on('error', () => {
      //   console.log(player.error())
      // })

      player.on('fullscreenchange', () => {
        if (player.isFullscreen()) {
          document
            .getElementsByClassName('vjs-container')[0]
            .classList.add('vjs-container-show')
        } else {
          document
            .getElementsByClassName('vjs-container')[0]
            .classList.remove('vjs-container-show')
        }
      })

      // player.on('touchend', e => {
      //   if (!liveStream || is_iosTouchscreen) return;
      //   if (playerTapTouch.current) {
      //     clearTimeout(playerTapTouch.current);
      //     playerTapTouch.current = '';
      //     if (
      //       Math.abs(playerTapLocation.current - e.changedTouches[0].clientX) <
      //       60
      //     ) {
      //       if (
      //         playerTapLocation.current < videoPlayerEle!.offsetWidth / 2 &&
      //         e.changedTouches[0].clientX < videoPlayerEle!.offsetWidth / 2
      //       ) {
      //         backwardButtonOnClick();
      //       } else if (
      //         playerTapLocation.current > videoPlayerEle!.offsetWidth / 2 &&
      //         e.changedTouches[0].clientX > videoPlayerEle!.offsetWidth / 2
      //       ) {
      //         forwardButtonOnClick();
      //       }
      //     }
      //   } else {
      //     playerTapLocation.current = e.changedTouches[0].clientX;
      //     playerTapTouch.current = setTimeout(() => {
      //       clearTimeout(playerTapTouch.current);
      //       playerTapTouch.current = '';
      //     }, 500);
      //   }
      // });

      // IVS 플레이어 에러 핸들러 추가
      //   ivsPlayer.addEventListener(events.PlayerEventType.ERROR, payload => {
      //     const { code } = payload;
      //     player.errors();
      //     player.error({
      //       code,
      //       message: 'Something went wrong. Please reload the page.',
      //       dismiss: true,
      //     });
      //   });
    } else {
      bufferingStartTime.current = new Date().getTime()
      rewindUrlLoaded.current = false
      seekBackTimeLocation.current = 0

      const seekBarRangeEle = document.getElementById('seekbar-range')
      const liveButtonEle = document.getElementsByClassName(
        'vjs-live-display'
      )[0]
      liveButtonEle.innerHTML = `<div class="live-text"><div class="bold-bullet"></div>${t(
        'common.live_tag_text'
      )}</div>`

      resetRefs()
      //@ts-ignore
      seekBarRangeEle.value = 100
      seekBarRangeEle!.style.backgroundSize = '100% 100%'
      currentQualityRef.current = null

      const player = playerRef.current

      const tech = player.el().querySelector('.vjs-tech')
      if (tech) {
        tech.removeAttribute('poster')
      }

      player.poster(poster)
      handleIncludeCredsOnSrc(playerLiveVideoSource.current)
      player.src(playerLiveVideoSource.current!)

      const titleOverlay = document.getElementsByClassName('vjs-overlay')[0]
      titleOverlay.innerHTML = overlayContent
    }
  }, [src, overlayContent, poster, createdAt, rewindurl])

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
        clearInterval(timeIntervalIdRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Mute and unmute text is coming from videojs elements button title attribute
    // When the language or mute status changes here we are accessing the muteToggle from volume panel
    // and updating the text based on mute status to show text based on language

    const player = playerRef.current
    if (!player) return

    const updateMuteUnmuteButtonText = () => {
      const muteToggleVolumePanel = player?.controlBar?.getChild('VolumePanel')
      const muteToggle = muteToggleVolumePanel?.getChild('muteToggle')
      if (muteToggleVolumePanel && muteToggle) {
        muteToggle.controlText(
          player.muted() || player.volume() === 0
            ? t('community.mutedUsers.unmuteText')
            : t('mute')
        )
      }
    }

    updateMuteUnmuteButtonText()

    // This is for updating inner live text as per selected language
    const liveButtonElement = document.getElementsByClassName(
      'vjs-live-display'
    )?.[0]

    if (liveButtonElement) {
      liveButtonElement.innerHTML = `<div class="live-text"><div class="bold-bullet"></div>${t(
        'common.live_tag_text'
      )}</div>`
    }

    player.on('volumechange', updateMuteUnmuteButtonText)
    // Cleanup
    return () => {
      player.off('volumechange', updateMuteUnmuteButtonText)
    }
  }, [i18n.language])

  return (
    <Box
      className="video-container"
      height="100%"
      width="100%"
      position="relative"
    >
      <video
        id="amazon-ivs-videojs"
        className="video-js"
        controls
        autoPlay
        playsInline
      />
    </Box>
  )
}

export default IVSPlayer
