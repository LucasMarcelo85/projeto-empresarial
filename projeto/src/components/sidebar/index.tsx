"use client";

import { ReactNode, useContext } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  Text,
  Image,
  useDisclosure,
  type BoxProps,
  type FlexProps,
} from "@chakra-ui/react";

import {
  FiScissors,
  FiClipboard,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiActivity, 
  FiUsers,
} from "react-icons/fi";

import type { IconType } from "react-icons";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}

// ADICIONANDO PAGES NO SIDEBAR
const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiActivity, route: "/dashboard" }, 
  { name: "Serviços", icon: FiClipboard, route: "/haircuts" },
  { name: "Agenda", icon: FiScissors, route: "/dash_agenda" },
  { name: "Clientes", icon: FiUsers, route: "/clientes" },
  { name: "Minha Conta", icon: FiSettings, route: "/profile" },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="barber.900">
      <SidebarContent
        onClose={() => onClose()}
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
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { logoutUser } = useContext(AuthContext);

  return (
    <Box
      bg="barber.400"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
        <Link href="/dashboard">
          <Flex
            cursor="pointer"
            userSelect="none"
            flexDirection="row"
            align="center"
            ml={4}
          >
            <Image
              src="/images/logo.png"
              alt="Logo Meu Barbeiro PRO"
              boxSize="130px"
              objectFit="contain"
              mr="2"
            />
          </Flex>
        </Link>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          color="white"
        />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem icon={link.icon} route={link.route} key={link.name}>
          {link.name}
        </NavItem>
      ))}

      {/* Botão Sair */}
      <Flex
        position="absolute"
        bottom="4"
        left="4"
        right="4"
        align="center"
        color="white"
        p="4"
        borderRadius="lg"
        cursor="pointer"
        _hover={{ bg: "button.cta", color: "barber.900" }}
        onClick={logoutUser}
      >
        <Icon
          mr={4}
          color="red.300"
          fontSize="20"
          as={FiLogOut}
          _groupHover={{ color: "white" }}
        />
        <Text>Sair</Text>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  route: string;
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  return (
    <Link href={route} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        color="white"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "barber.900",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={4}
            color="button.cta"
            fontSize="20"
            as={icon}
            _groupHover={{ color: "white" }}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      color="White"
      alignItems="center"
      bg="barber.400"
      borderBottomWidth="1px"
      borderBottomColor="gray.700"
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="unstyled"
        onClick={onOpen}
        fontSize="23"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Flex flexDirection="row">
        <Text
          ml={8}
          fontSize="2x1"
          color="White"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          Meu Barbeiro
        </Text>
        <Text
          fontSize="2x1"
          fontFamily="monospace"
          fontWeight="bold"
          color="button.cta"
          ml={2}
        >
          PRO
        </Text>
      </Flex>
    </Flex>
  );
};
