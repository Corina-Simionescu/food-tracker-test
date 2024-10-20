import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

function AddFood() {
  const [inputFood, setInputFood] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chosenFoodName, setChosenFoodName] = useState("");
  const [originalNutritionData, setOriginalNutritionData] = useState({
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
    amount: 0,
    unit: "",
  });
  const [customNutritients, setCustomNutrients] = useState({
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  });
  const [customAmount, setCustomAmount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("error", "You need to sign in to add food");
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    setCustomAmount(originalNutritionData.amount);
  }, [originalNutritionData.amount]);

  useEffect(() => {
    setCustomNutrients(calculateNutrients(customAmount));
  }, [customAmount, originalNutritionData]);

  async function handleSearchFood() {
    const numberOfResultsPerCategory = 1;

    const url = `https://api.spoonacular.com/food/search?query=${inputFood}&number=${numberOfResultsPerCategory}&apiKey=${
      import.meta.env.VITE_SPOONACULAR_API_KEY
    }`;

    try {
      const response = await fetch(url);
      const responseData = await response.json();

      let reorderedResults = [];

      const simpleFoods = responseData.searchResults.find(
        (category) => category.name === "Simple Foods"
      );
      if (simpleFoods) {
        reorderedResults.push(simpleFoods);
      }

      const recipes = responseData.searchResults.find(
        (category) => category.name === "Recipes"
      );
      if (recipes) {
        reorderedResults.push(recipes);
      }

      const products = responseData.searchResults.find(
        (category) => category.name === "Products"
      );
      if (products) {
        reorderedResults.push(products);
      }

      const menuItems = responseData.searchResults.find(
        (category) => category.name === "Menu Items"
      );
      if (menuItems) {
        reorderedResults.push(menuItems);
      }

      setSearchResults(reorderedResults);
    } catch (error) {
      console.error("Error fetching searched foods: ", error);
    }
  }

  async function fetchSelectedFoodNutritionData(url, category) {
    try {
      const response = await fetch(url);
      const responseData = await response.json();

      let fetchedNutritionData = {
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        amount: 0,
        unit: "",
      };

      switch (category.name) {
        case "Recipes": {
          fetchedNutritionData.calories = responseData.nutrients.find(
            (nutrient) => nutrient.name == "Calories"
          ).amount;

          fetchedNutritionData.proteins = responseData.nutrients.find(
            (nutrient) => nutrient.name == "Protein"
          ).amount;

          fetchedNutritionData.carbohydrates = responseData.nutrients.find(
            (nutrient) => nutrient.name == "Carbohydrates"
          ).amount;

          fetchedNutritionData.fats = responseData.nutrients.find(
            (nutrient) => nutrient.name == "Fat"
          ).amount;

          fetchedNutritionData.amount = responseData.weightPerServing.amount;

          if (responseData.weightPerServing.unit === "g") {
            fetchedNutritionData.unit = "grams";
          } else {
            fetchedNutritionData.unit = responseData.weightPerServing.unit;
          }

          break;
        }
        case "Products": {
          fetchedNutritionData.calories = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Calories"
          ).amount;

          fetchedNutritionData.proteins = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Protein"
          ).amount;

          fetchedNutritionData.carbohydrates =
            responseData.nutrition.nutrients.find(
              (nutrient) => nutrient.name == "Carbohydrates"
            ).amount;

          fetchedNutritionData.fats = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Fat"
          ).amount;

          fetchedNutritionData.amount = responseData.servings.number;

          fetchedNutritionData.unit = "servings";

          break;
        }
        case "Menu Items": {
          fetchedNutritionData.calories = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Calories"
          ).amount;

          fetchedNutritionData.proteins = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Protein"
          ).amount;

          fetchedNutritionData.carbohydrates =
            responseData.nutrition.nutrients.find(
              (nutrient) => nutrient.name == "Carbohydrates"
            ).amount;

          fetchedNutritionData.fats = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Fat"
          ).amount;

          fetchedNutritionData.amount = responseData.servings.number;

          fetchedNutritionData.unit = "servings";

          break;
        }
        case "Simple Foods": {
          fetchedNutritionData.calories = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Calories"
          ).amount;

          fetchedNutritionData.proteins = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Protein"
          ).amount;

          fetchedNutritionData.carbohydrates =
            responseData.nutrition.nutrients.find(
              (nutrient) => nutrient.name == "Carbohydrates"
            ).amount;

          fetchedNutritionData.fats = responseData.nutrition.nutrients.find(
            (nutrient) => nutrient.name == "Fat"
          ).amount;

          fetchedNutritionData.amount = responseData.amount;

          if (responseData.unit === "g") {
            fetchedNutritionData.unit = "grams";
          } else {
            fetchedNutritionData.unit = responseData.unit;
          }

          break;
        }
      }

      setOriginalNutritionData(fetchedNutritionData);
      setCustomAmount(originalNutritionData.amount);
    } catch (error) {
      console.error("Error fetching nutrition for selected food: ", error);
    }
  }

  function handleFoodSelection(category, food) {
    let url;
    setChosenFoodName(food.name);

    switch (category.name) {
      case "Recipes":
        url = `https://api.spoonacular.com/recipes/${
          food.id
        }/nutritionWidget.json?apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`;
        break;
      case "Products":
        url = `https://api.spoonacular.com/food/products/${food.id}?apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`;
        break;
      case "Menu Items":
        url = `https://api.spoonacular.com/food/menuItems/${food.id}?apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`;
        break;
      case "Simple Foods":
        url = `https://api.spoonacular.com/food/ingredients/${
          food.id
        }/information?amount=100&unit=grams&apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`;
        break;
    }

    fetchSelectedFoodNutritionData(url, category);
    onOpen();
  }

  function calculateNutrients(customAmount) {
    customAmount = parseFloat(customAmount);

    if (isNaN(customAmount) || customAmount === 0) {
      return { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 };
    }

    //rule of third
    return {
      calories:
        (customAmount / originalNutritionData.amount) *
        originalNutritionData.calories,
      proteins:
        (customAmount / originalNutritionData.amount) *
        originalNutritionData.proteins,
      carbohydrates:
        (customAmount / originalNutritionData.amount) *
        originalNutritionData.carbohydrates,
      fats:
        (customAmount / originalNutritionData.amount) *
        originalNutritionData.fats,
    };
  }

  async function sendDataToServer() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/food-tracker/food`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: new Date(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            foodName: chosenFoodName,
            amount: customAmount,
            unit: originalNutritionData.unit,
            calories: customNutritients.calories,
            proteins: customNutritients.proteins,
            carbohydrates: customNutritients.carbohydrates,
            fats: customNutritients.fats,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: responseData.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose();
      } else {
        toast({
          title: "Error",
          description: responseData.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error sending data to server: ", error);
    }

    onClose();
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      paddingTop="5rem"
    >
      <Heading textColor="#ffffff">Search food</Heading>
      <InputGroup width="40rem" marginTop="3rem">
        <Input
          type="text"
          placeholder="e.g., pizza"
          backgroundColor="#222222"
          textColor="#ffffff"
          border="0.05rem solid #bfbfbf"
          borderRadius="1rem"
          cursor="text"
          _placeholder={{ fontStyle: "italic", textColor: "#bfbfbf" }}
          onChange={(event) => setInputFood(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearchFood();
            }
          }}
        ></Input>
        <InputRightElement width="5rem">
          <Button
            backgroundColor="#333333"
            textColor="#ffffff"
            borderRadius="1rem"
            border="0.05rem solid #bfbfbf"
            _hover={{
              boxShadow: "0 0 2px 2px  #737373",
            }}
            onClick={handleSearchFood}
          >
            Search
          </Button>
        </InputRightElement>
      </InputGroup>

      {searchResults.length > 0 && (
        <VStack
          spacing={4}
          align="stretch"
          width="40rem"
          marginTop="1rem"
          backgroundColor="#222222"
          borderRadius="1rem"
          padding="1rem"
          border="0.05rem solid #bfbfbf"
        >
          {searchResults.map((category) =>
            category.results.map((food) => (
              <Box
                key={food.id}
                display="flex"
                alignItems="center"
                background="#333333"
                textColor="#ffffff"
                padding="1rem"
                borderRadius="1rem"
                cursor="pointer"
                _hover={{ boxShadow: "0 0 2px 2px  #737373" }}
                onClick={() => handleFoodSelection(category, food)}
              >
                {food.image && (
                  <Image
                    src={food.image}
                    alt={food.name}
                    boxSize="50px"
                    objectFit="cover"
                    margin={3}
                  />
                )}
                <Text fontSize="lg">{food.name}</Text>
              </Box>
            ))
          )}
        </VStack>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>

        <ModalContent
          backgroundColor="#404040"
          textColor="#ffffff"
          maxWidth="40rem"
          border="0.05rem solid #bfbfbf"
          boxShadow="0 0 3px 3px  #737373"
        >
          <ModalHeader textAlign="center" marginY="1.5rem">
            {chosenFoodName}
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>

          <TableContainer
            width="80%"
            backgroundColor="#222222"
            border="0.05rem solid #bfbfbf"
            borderRadius="1rem"
            margin="0 auto"
          >
            <Table
              variant="simple"
              sx={{
                Td: {
                  borderBottom: "0.05rem solid #bfbfbf",
                },
              }}
            >
              <Tbody>
                <Tr>
                  <Td border="0">
                    Amount{"   "}
                    <Tooltip
                      label="Set the amount as needed"
                      placement="top"
                      backgroundColor="#e6e6e6"
                      textColor="#000000"
                      fontSize="1rem"
                    >
                      <InfoOutlineIcon></InfoOutlineIcon>
                    </Tooltip>
                  </Td>
                  <Td>
                    <NumberInput
                      value={customAmount}
                      min={0}
                      onChange={(inputAmount) => {
                        setCustomAmount(inputAmount);
                      }}
                      width="10rem"
                    >
                      <NumberInputField></NumberInputField>
                      <NumberInputStepper>
                        <NumberIncrementStepper
                          color="#ffffff"
                          _active={{ backgroundColor: "#595959" }}
                        ></NumberIncrementStepper>
                        <NumberDecrementStepper
                          color="#ffffff"
                          _active={{ backgroundColor: "#595959" }}
                        ></NumberDecrementStepper>
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                  <Td>{originalNutritionData.unit}</Td>
                </Tr>
                <Tr>
                  <Td>Calories</Td>
                  <Td>{Math.round(customNutritients.calories)}</Td>
                  <Td>kcal</Td>
                </Tr>
                <Tr>
                  <Td>Proteins</Td>
                  <Td>{Math.round(customNutritients.proteins)}</Td>
                  <Td>grams</Td>
                </Tr>
                <Tr>
                  <Td>Carbohydrates</Td>
                  <Td>{Math.round(customNutritients.carbohydrates)}</Td>
                  <Td>grams</Td>
                </Tr>
                <Tr sx={{ Td: { border: "0" } }}>
                  <Td>Fats</Td>
                  <Td>{Math.round(customNutritients.fats)}</Td>
                  <Td>grams</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          <ModalFooter
            display="flex"
            justifyContent="center"
            gap="1rem"
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
            <Button onClick={sendDataToServer}>Add food</Button>
            <Button onClick={onClose}>Cancel </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AddFood;
