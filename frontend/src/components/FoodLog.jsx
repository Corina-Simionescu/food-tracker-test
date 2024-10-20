import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function FoodLog() {
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    async function fetchFoodLog() {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("error", "You need to sign in");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`/api/food-tracker/food`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.setItem("error", "You need to sign in");
          navigate("/");
          return;
        }

        const responseData = await response.json();

        if (response.ok) {
          responseData.forEach((foodLogEntry) => {
            const yearMonthDay = foodLogEntry.date.split("T")[0];
            const year = yearMonthDay.split("-")[0];
            const month = yearMonthDay.split("-")[1];
            const day = yearMonthDay.split("-")[2];
            const formattedDate = `${day}/${month}/${year}`;

            foodLogEntry.date = formattedDate;
          });

          setFoodLog(responseData);
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchFoodLog();
  }, []);

  return (
    <Box maxWidth="70%" margin="0 auto">
      {foodLog
        .slice()
        .reverse()
        .map((foodLogEntry, index) => (
          <Box key={index} marginTop="2rem">
            <Text
              fontSize="2rem"
              fontWeight="bold"
              textColor="#ffffff"
              borderRadius="0.5rem"
              marginBottom="1rem"
            >
              {foodLogEntry.date}
            </Text>
            <Table
              variant="simple"
              backgroundColor="#464646"
              sx={{
                borderCollapse: "separate",
                borderSpacing: "0 0.5rem",
              }}
            >
              <Thead backgroundColor="#333333">
                <Tr>
                  <Th
                    width="25%"
                    textColor="#ffffff"
                    borderRadius="1rem 0 0 1rem"
                    border="0"
                  >
                    Food Name
                  </Th>
                  <Th
                    width="10%"
                    textColor="#ffffff"
                    textAlign="center"
                    border="0"
                  >
                    Amount
                  </Th>
                  <Th
                    width="10%"
                    textColor="#ffffff"
                    textAlign="center"
                    border="0"
                  >
                    Calories
                  </Th>
                  <Th
                    width="10%"
                    textColor="#ffffff"
                    textAlign="center"
                    border="0"
                  >
                    Proteins (g)
                  </Th>
                  <Th
                    width="10%"
                    textColor="#ffffff"
                    textAlign="center"
                    border="0"
                  >
                    Carbs (g)
                  </Th>
                  <Th
                    width="10%"
                    textColor="#ffffff"
                    textAlign="center"
                    borderRadius="0  1rem 1rem 0"
                    border="0"
                  >
                    Fats (g)
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {foodLogEntry.foods.map((food, foodIndex) => (
                  <Tr key={foodIndex} backgroundColor="#222222">
                    <Td
                      fontSize="130%"
                      textColor="#ffffff"
                      border="0"
                      borderRadius="1rem 0 0 1rem"
                    >
                      {food.name}
                    </Td>
                    <Td
                      textColor="#ffffff"
                      textAlign="center"
                      border="0"
                    >{`${food.amount} ${food.unit}`}</Td>
                    <Td textColor="#ffffff" textAlign="center" border="0">
                      {Math.round(food.calories)}
                    </Td>
                    <Td textColor="#ffffff" textAlign="center" border="0">
                      {Math.round(food.proteins)}
                    </Td>
                    <Td textColor="#ffffff" textAlign="center" border="0">
                      {Math.round(food.carbohydrates)}
                    </Td>
                    <Td
                      textColor="#ffffff"
                      textAlign="center"
                      border="0"
                      borderRadius="0 1rem 1rem 0"
                    >
                      {Math.round(food.fats)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ))}
    </Box>
  );
}

export default FoodLog;
