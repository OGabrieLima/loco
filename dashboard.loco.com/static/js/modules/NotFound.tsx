import NotFoundDashboard from '@src/components/NotFound/NotFoundDashboard'
export const NotFound = NotFoundDashboard

// import { Flex, Icon, Stack, Text } from '@chakra-ui/core'
// import React from 'react'

// import { Container } from '../components/Container/Container'

// export const NotFound = (): JSX.Element => {
//   // window.onload = function() {
//   //   //@ts-ignore
//   //   window.location = '/';
//   // };
//   return (
//     <Container
//       sideBar={true}
//       hideNavBar={true}
//       h="100vh"
//       alignItems="center"
//       style={{
//         background: `linear-gradient(to bottom, #121212 0%, #121212 40%, #050506 40%, #050506 100%)`,
//       }}
//     >
//       <Icon
//         //@ts-ignore
//         name="loco"
//         size="128px"
//       />
//       <Flex
//         w={['xs', 'sm', 'xl']}
//         flexDir="column"
//         h="350px"
//         bg="white"
//         alignItems="center"
//         justifyContent="center"
//         alignContent="center"
//         rounded={10}
//         color="black"
//         px={[4, 4, 16]}
//         pb={8}
//       >
//         <Stack spacing={5} w="full" align="center">
//           <Icon
//             name="warning"
//             size="24"
//             color="brand.primary-red"
//             display={['none', 'none', 'inline-block']}
//           />
//           <Icon
//             name="warning"
//             size="20"
//             color="brand.primary-red"
//             display={['inline-block', 'inline-block', 'none']}
//           />
//           <Text
//             fontSize="2xl"
//             color="brand.primary-red"
//             fontWeight="bold"
//             textAlign="center"
//           >
//             Access Denied
//           </Text>
//           <Text textAlign="center" fontWeight="medium">
//             Please contact the Loco Support Team <br />
//             for Streamer Dashboard Access.
//           </Text>
//         </Stack>
//       </Flex>
//     </Container>
//   )
// }
