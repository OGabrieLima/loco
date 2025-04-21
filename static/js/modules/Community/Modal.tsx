import {
  Box,
  Button,
  ButtonProps,
  FlexProps,
  IModal,
  Spinner,
  Text,
} from '@chakra-ui/core'
import NewModal from '@components/NewModal'
import styled from '@emotion/styled'
import i18n from 'i18next'
import React, { ReactNode } from 'react'

type IModalProps = {
  subTitle1?: ReactNode
  subTitle2?: ReactNode
  onSuccess?: () => void
  className?: string
  modalContentStyle?: FlexProps
  loader?: boolean
}

const P = styled(Text)`
  @media only screen and (max-width: 47.95rem) {
    font-size: 16px;
  }
`

const StyledButton = styled(Button)`
  @media only screen and (max-width: 47.95rem) {
    height: 40px;
  }
`

const Modal = ({
  isOpen,
  onClose,
  onSuccess,
  subTitle1,
  subTitle2,
  className,
  modalContentStyle,
  loader,
}: IModalProps & Omit<IModal, 'children'>): JSX.Element => (
  <NewModal
    isOpen={isOpen}
    onClose={onClose}
    isCentered={true}
    className={className}
    modalContentStyle={{
      maxWidth: ['100%', '494px'],
      minWidth: ['100%', '494px'],
      width: ['100%', '494px'],
      padding: ['16px', '24px'],
      borderRadius: ['16px 16px 0 0', '12px'],
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginTop: '0',
      ...modalContentStyle,
    }}
    modalHeaderStyle={{
      padding: '16px 0 0 0',
    }}
    modalHeaderComponent={
      <>
        {subTitle1 && (
          <P
            textAlign="center"
            as="h3"
            fontSize={['16px']}
            fontWeight="400"
            lineHeight="130%"
          >
            {subTitle1}
          </P>
        )}
        {subTitle2 && (
          <P
            as="h5"
            fontSize="16px"
            color="#fff"
            opacity={0.75}
            lineHeight="130%"
            fontWeight="400"
            margin="16px auto 0"
            textAlign="center"
          >
            {subTitle2}
          </P>
        )}
      </>
    }
    modalBodyStyle={{
      padding: '0',
    }}
    modalBodyComponent={
      <Box
        display="flex"
        justifyContent={['space-evenly', 'space-between']}
        margin={['30px auto auto', '30px auto auto']}
        padding={[0, 0]}
        maxWidth={['100%', '332px']}
      >
        <ButtonComponent
          backgroundColor="transparent"
          border={'2px'}
          borderColor={'brand.loco-primary'}
          color="brand.loco-primary"
          onClick={onSuccess}
        >
          <>
            {loader ? (
              <>
                <Spinner size="sm" />
                &nbsp;&nbsp;
              </>
            ) : null}
            <span> {i18n.t('community.moderators.yes')}</span>
          </>
        </ButtonComponent>
        <ButtonComponent
          backgroundColor="brand.loco-primary"
          color="white"
          onClick={onClose}
          isDisabled={loader}
        >
          {i18n.t('community.moderators.no')}
        </ButtonComponent>
      </Box>
    }
  />
)

const ButtonComponent = ({
  backgroundColor,
  children,
  ...rest
}: ButtonProps) => (
  <StyledButton
    borderRadius="10px"
    width="150px"
    height="48px"
    fontWeight="bold"
    fontSize="14px"
    lineHeight={'130%'}
    backgroundColor={backgroundColor}
    _focus={{
      backgroundColor: backgroundColor,
    }}
    _active={{
      backgroundColor: backgroundColor,
    }}
    _hover={{
      backgroundColor: backgroundColor,
    }}
    {...rest}
  >
    {children}
  </StyledButton>
)

export default Modal
