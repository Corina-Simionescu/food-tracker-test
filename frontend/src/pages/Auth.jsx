import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

function Auth() {
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const [signUpData, setSignUpData] = useState({ username: "", password: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const errorMessage = localStorage.getItem("error");

    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      localStorage.removeItem("error");
    }
  }, []);

  async function handleSignIn(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signInData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("token", responseData.token);
        navigate("/food-tracker");
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: responseData.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        onClose();
      } else {
        toast({
          title: "Error",
          description: responseData.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: responseData.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      paddingTop="2rem"
      backgroundColor="#222222"
    >
      <Heading
        textAlign="center"
        textColor="#ffffff"
        fontSize="3rem"
        paddingBottom="3rem"
      >
        Food Tracker
      </Heading>
      <form onSubmit={handleSignIn}>
        <Box width="30%" margin="0 auto">
          <FormControl isRequired textColor="#ffffff" marginBottom="2rem">
            <FormLabel htmlFor="signInUsername">Username</FormLabel>
            <Input
              type="text"
              id="signInUsername"
              name="signInUsername"
              onChange={(e) =>
                setSignInData((prevData) => ({
                  ...prevData,
                  username: e.target.value,
                }))
              }
            ></Input>
          </FormControl>

          <FormControl isRequired textColor="#ffffff">
            <FormLabel htmlFor="signInPassword">Password</FormLabel>
            <Input
              type="password"
              id="signInPassword"
              name="signInPassword"
              onChange={(e) =>
                setSignInData((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }))
              }
            ></Input>
          </FormControl>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          paddingTop="2rem"
          gap="3rem"
          sx={{
            Button: {
              backgroundColor: "#222222",
              textColor: "#ffffff",
              border: "0.05rem solid #bfbfbf",
              "&:hover": {
                boxShadow: "0 0 3px 3px  #737373",
                backgroundColor: "#222222",
              },
            },
          }}
        >
          <Button type="submit">Sign In</Button>
          <Button onClick={onOpen}>New user</Button>
        </Box>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>

        <ModalContent
          backgroundColor="#404040"
          textColor="#ffffff"
          maxWidth="30rem"
          padding="1rem"
          border="0.05rem solid #bfbfbf"
          boxShadow="0 0 3px 3px  #737373"
        >
          <ModalHeader textAlign="center" fontSize="1.5rem">
            Create Account
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>

          <form onSubmit={handleSignUp}>
            <ModalBody>
              <FormControl isRequired marginBottom="1.5rem">
                <FormLabel htmlFor="signUpUsername">Username</FormLabel>
                <Input
                  type="text"
                  id="signUpUsername"
                  name="signUpUsername"
                  onChange={(e) =>
                    setSignUpData((prevData) => ({
                      ...prevData,
                      username: e.target.value,
                    }))
                  }
                ></Input>
              </FormControl>

              <FormControl isRequired marginBottom="1.5rem">
                <FormLabel htmlFor="signUpPassword">Password</FormLabel>
                <Input
                  type="password"
                  id="signUpPassword"
                  name="signUpPassword"
                  onChange={(e) =>
                    setSignUpData((prevData) => ({
                      ...prevData,
                      password: e.target.value,
                    }))
                  }
                ></Input>
              </FormControl>
            </ModalBody>

            <ModalFooter
              display="flex"
              justifyContent="center"
              gap="1rem"
              sx={{
                Button: {
                  type: "submit",
                  backgroundColor: "#222222",
                  textColor: "#ffffff",
                  border: "0.05rem solid #bfbfbf",
                  "&:hover": {
                    boxShadow: "0 0 3px 3px  #737373",
                    backgroundColor: "#222222",
                  },
                },
              }}
            >
              <Button type="submit">Create Account</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Auth;
