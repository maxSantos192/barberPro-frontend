import { Children, ReactNode } from "react"
import { IconType } from "react-icons"
import Link from "next/link"

import {
    FiScissors,
    FiClipboard,
    FiSettings,
    FiMenu,
} from "react-icons/fi"

import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useColorModeValue,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
} from "@chakra-ui/react"

interface LinkItemProps {
    name: string
    icon: IconType
    route: string
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Agenda', icon: FiScissors, route: '/dashboard' },
    { name: 'Cortes', icon: FiClipboard, route: '/haircuts' },
    { name: 'Minha Conta', icon: FiSettings, route: '/profile' },
]

export function Sidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box minHeight={"100vh"} background="barber.900">
            <SidebarContent
                onClose={() => onClose}
                display={{ base: "none", md: "block" }}
            />

            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
                onClose={onClose}
            >

                <DrawerContent>
                    <SidebarContent onClose={() => onClose()} />
                </DrawerContent>

            </Drawer>

            <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />

            <Box marginLeft={{ base: 0, md: 60 }} padding={4}>
                {children}
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            background="barber.400"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            width={{ base: 'full', md: 60 }}
            position="fixed"
            height="full"
            {...rest}
        >
            <Flex height={20} alignItems="center" justifyContent="space-between" marginX={8}>
                <Link href="/dashboard">
                    <Flex cursor="pointer" userSelect="none" flexDirection="row">
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">Pro</Text>
                    </Flex>
                </Link>
                <CloseButton color="white" display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
            {LinkItems.map(link => (
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}

interface NavItemProps {
    icon: IconType
    children: ReactNode
    route: string
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
    return (
        <Link href={route} style={{ color: "white" }}>
            <Flex
                align="center"
                padding={4}
                marginX={4}
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    background: "barber.900",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        marginRight={4}
                        fontSize={16}
                        as={icon}
                        _groupHover={{
                            color: "white"
                        }}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}

// Drawer mobile
interface MobileProps extends FlexProps {
    onOpen: () => void
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            marginLeft={{ base: 0, md: 60 }}
            paddingX={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            background={useColorModeValue("#1B1C29", "#1B1C29")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu color="white" />}
                background="#1B1C29"
            />
            <Flex flexDirection="row">
                <Text marginLeft={8} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">Pro</Text>
            </Flex>
        </Flex>
    )
}