import Head from 'next/head'
import { Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>BarberPRO - Seu sistema completo</title>
      </Head>
      <Flex background={"barber.900"} height={"100vh"} alignItems={"center"} justifyContent={"center"} direction={"column"}>
        <Text fontSize={30} color={"white"}>Em construção</Text>
        <Link href={"/login"}>
          <Button size={"lg"} background={"button.cta"}>
            <Text fontSize={30} color={"barber.900"}>Clique aqui para acessar</Text>
          </Button>
        </Link>
      </Flex>
    </>
  )
}