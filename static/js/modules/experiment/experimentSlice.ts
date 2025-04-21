import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICountryPhoneList } from '@src/constants/countryList'
import experiment from '@src/utils/Amplitude/experiment'

interface IExpConfigTypes {
  is_quest_rewards_enabled: boolean
  is_login_with_phone_enabled: boolean
  country_phone_list: Array<ICountryPhoneList>
}

const defaultValues: IExpConfigTypes = {
  //  add new feature config here with the key defined in above featureFlagsConfigs variable
  is_quest_rewards_enabled: false,
  is_login_with_phone_enabled: false,
  country_phone_list: [],
}

enum FeatureConfigFlag {
  REWARD_QUEST_CONFIG = 'quest-rewards-config',
  COUNTRY_PICKER_CONFIG = 'country_picker_config',
  ON_BOARDING_CONFIG = 'on-boarding-config',
}
interface ExperimentState extends IExpConfigTypes {
  error: string | null
}

// Initial state
const initialState: ExperimentState = {
  ...defaultValues,
  error: null,
}

// Redux slice
const experimentSlice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperimentAmplitude.fulfilled, (state, action) => {
        return { ...state, ...action.payload }
      })
      .addCase(fetchExperimentAmplitude.rejected, (state, action) => {
        state.error = action.payload as string
      })

    builder
      .addCase(fetchExperimentLocalHost.fulfilled, (state, action) => {
        return { ...state, ...action.payload }
      })
      .addCase(fetchExperimentLocalHost.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export default experimentSlice.reducer

const fetchAmplitudeExperimentConfig = () => {
  const us = { ...defaultValues }
  {
    // link: // https://app.amplitude.com/experiment/loco/197581/config/379655/configure
    const featureConfigData = experiment.variant(
      FeatureConfigFlag.REWARD_QUEST_CONFIG
    )
    const payload = featureConfigData?.payload || {}
    us.is_quest_rewards_enabled = !!payload?.feature_enabled
  }
  // For showing login with phone option
  {
    const onBoardingConfigData = experiment.variant(
      FeatureConfigFlag.ON_BOARDING_CONFIG
    )
    const onBoardingConfigPayload = onBoardingConfigData.payload || {}
    us.is_login_with_phone_enabled = !!onBoardingConfigPayload?.login_with_otp
  }
  // For country list
  {
    const countryListConfigData = experiment.variant(
      FeatureConfigFlag.COUNTRY_PICKER_CONFIG
    )
    const countryPayload = countryListConfigData.payload || {}
    const countryList = countryPayload?.countries_available

    if (Array.isArray(countryList) && countryList?.length) {
      const transformedCountryList = countryList?.map((country) => {
        const { country_code, phone_code, flag, country_name } = country || {}
        return {
          value: country_code,
          label: phone_code,
          image: flag,
          full_name: country_name?.default,
        }
      })
      us.country_phone_list = transformedCountryList
    }
  }

  // {
  //   // This was only for testing purpose. | Feature Config wali Config for Dev
  //   // link: https://app.amplitude.com/experiment/loco/197581/config/379126/configure
  //   const featureConfigData = experiment.variant('feature-config')
  //   // Because payload can be anything, we need to check if it exists
  //   const fcp = featureConfigData?.payload || {}
  //   if (featureConfigData?.payload && Object.keys(fcp).length > 0) {
  //     us.is_pix_enabled = !!fcp?.is_pix_enabled
  //     us.is_quest_rewards_enabled = !!fcp?.is_quest_rewards_enabled
  //     us.is_stripe_enabled = !!fcp?.is_stripe_enabled
  //     us.is_subsrciption_enabled = !!fcp?.is_subsrciption_enabled
  //   }
  // }

  return us
}

// Async thunk for fetching experiment data
export const fetchExperimentAmplitude = createAsyncThunk(
  'experiment/fetchExperimentAmplitude',
  async (
    userParams: {
      user_id: string
      device_id: string
      user_properties: {
        user_id: string
        device_id: string
        app_country_name: string
        app_platform: string
      }
    },
    { rejectWithValue }
  ) => {
    try {
      await experiment.fetch(userParams)
      const us = fetchAmplitudeExperimentConfig()
      return us
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to fetch experiment data'
      )
    }
  }
)

export const fetchExperimentLocalHost = createAsyncThunk(
  'experiment/fetchExperimentLocalHost',
  async (_, { rejectWithValue }) => {
    try {
      const us = fetchAmplitudeExperimentConfig()
      return us
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to fetch experiment data'
      )
    }
  }
)
