import { useState, useContext } from "react"
import Head from "next/head"
import Image from "next/image"
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import Link from "next/link"
import logo from "../../../public/images/logo.svg"
import { AuthContext } from "@/contexts/AuthContext"
import { canSSRGuest } from "@/utils/canSSRGuest"

export default function Login() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    if (email === '' || password === '') {
      alert("Preencha os dados para login")
      return
    }
    await signIn({
      email,
      password,
    })
  }

  return (
    <>
      <Head>
        <title>Barber Pro - Acesse sua conta</title>
      </Head>
      <Flex background="barber.900" height={"100vh"} alignItems={"center"} justifyContent={"center"}>
        <Flex width={640} direction={"column"} padding={14} rounded={8}>
          <Center padding={4}>
            <Image
              src={logo}
              alt="Logo Barber Pro"
              quality={100}
              priority={true}
              width={240}
            />
          </Center>
          <Input
            background={"barber.400"}
            color={"white"}
            size={"lg"}
            variant={"filled"}
            placeholder="Email"
            type="email"
            marginBottom={3}
            _hover={{ background: "barber.400" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            background={"barber.400"}
            color={"white"}
            size={"lg"}
            variant={"filled"}
            placeholder="Senha"
            type="text"
            marginBottom={6}
            _hover={{ background: "barber.400" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            background={"button.cta"}
            marginBottom={6}
            color="gray.900"
            size="lg"
            _hover={{ background: "#ffb13e" }}
            onClick={handleLogin}
          >
            Entrar
          </Button>

          <Center marginTop={2}>
            <Link href="/register">
              <Text cursor="pointer" color="#fff">Não possui conta? <strong>Registre-se</strong></Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})