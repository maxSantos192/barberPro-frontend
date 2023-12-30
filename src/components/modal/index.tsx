import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex
} from "@chakra-ui/react"
import { FiUser, FiScissors } from "react-icons/fi"
import { FaMoneyBillAlt } from "react-icons/fa"
import { ScheduleItem } from "@/pages/dashboard"

interface ModalInfoProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    data: ScheduleItem
    finishServise: () => Promise<void>
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishServise }: ModalInfoProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent background={"barber.400"}>
                <ModalHeader color={"white"}>Próximo</ModalHeader>
                <ModalCloseButton color={"white"} />

                <ModalBody>
                    <Flex alignItems={"center"} marginBottom={3}>
                        <FiUser size={28} color={"#ffb13e"} />
                        <Text color={"white"} marginLeft={3} fontSize={"2xl"} fontWeight={"bold"}>{data?.customer}</Text>
                    </Flex>

                    <Flex alignItems={"center"} marginBottom={3}>
                        <FiScissors size={28} color={"#fff"} />
                        <Text color={"white"} marginLeft={3} fontSize={"2xl"} fontWeight={"bold"}>{data?.haircut.name}</Text>
                    </Flex>

                    <Flex alignItems={"center"} marginBottom={3}>
                        <FaMoneyBillAlt size={28} color={"#46ef75"} />
                        <Text color={"white"} marginLeft={3} fontSize={"2xl"} fontWeight={"bold"}>R$ {data?.haircut.price}</Text>
                    </Flex>

                    <ModalFooter>
                        <Button background={"button.cta"} _hover={{ bg: "#ffb13e" }} color={"#fff"} marginRight={3} onClick={() => finishServise()}>Finalizar</Button>
                    </ModalFooter>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}