import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

function NutritionProgress({ targetNutrition }) {
  const navigate = useNavigate();
  const [consumedNutrition, setConsumedNutrition] = useState({
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  });

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
          return responseData;
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    async function calculateConsumedNutrition() {
      const foodLog = await fetchFoodLog();

      let consumedCalories = 0;
      let consumedProteins = 0;
      let consumedCarbohydrates = 0;
      let consumedFats = 0;

      const today = new Date().toISOString().split("T")[0];

      foodLog.forEach((foodLogEntry) => {
        const entryDate = foodLogEntry.date.split("T")[0];

        if (entryDate === today) {
          foodLogEntry.foods.forEach((food) => {
            consumedCalories += food.calories;
            consumedProteins += food.proteins;
            consumedCarbohydrates += food.carbohydrates;
            consumedFats += food.fats;
          });
        }
      });

      setConsumedNutrition({
        calories: Math.round(consumedCalories),
        proteins: Math.round(consumedProteins),
        carbohydrates: Math.round(consumedCarbohydrates),
        fats: Math.round(consumedFats),
      });
    }

    calculateConsumedNutrition();
  }, []);

  return (
    <Box
      textColor="#ffffff"
      display="flex"
      justifyContent="center"
      gap="2rem"
      width="100%"
    >
      <CircularProgress
        value={
          targetNutrition.calories === 0
            ? 0
            : (consumedNutrition.calories / targetNutrition.calories) * 100
        }
        size="17rem"
        trackColor="#303030"
        color="#80ccff"
      >
        <CircularProgressLabel
          display="flex"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="1rem"
          >
            <Box fontSize="2.5rem">{consumedNutrition.calories}</Box>
            <Box fontSize="1.8rem" padding="0 0.5rem 0 0.5rem">
              /
            </Box>
            <Box fontSize="1.8rem" marginTop="0.2rem">
              {targetNutrition.calories || 0}
            </Box>
          </Box>

          <Box fontSize="1.5rem">calories</Box>
        </CircularProgressLabel>
      </CircularProgress>

      <CircularProgress
        value={
          targetNutrition.proteins === 0
            ? 0
            : (consumedNutrition.proteins / targetNutrition.proteins) * 100
        }
        size="17rem"
        trackColor="#303030"
        color="#9fff80"
      >
        <CircularProgressLabel
          display="flex"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="1rem"
          >
            <Box fontSize="2.5rem">{consumedNutrition.proteins}</Box>
            <Box fontSize="1.8rem" padding="0 0.5rem 0 0.5rem">
              /
            </Box>
            <Box fontSize="1.8rem" marginTop="0.2rem">
              {targetNutrition.proteins || 0}
            </Box>
          </Box>

          <Box fontSize="1.5rem">proteins</Box>
        </CircularProgressLabel>
      </CircularProgress>

      <CircularProgress
        value={
          targetNutrition.carbohydrates === 0
            ? 0
            : (consumedNutrition.carbohydrates /
                targetNutrition.carbohydrates) *
              100
        }
        size="17rem"
        trackColor="#303030"
        color="#ffff66"
      >
        <CircularProgressLabel
          display="flex"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="1rem"
          >
            <Box fontSize="2.5rem">{consumedNutrition.carbohydrates}</Box>
            <Box fontSize="1.8rem" padding="0 0.5rem 0 0.5rem">
              /
            </Box>
            <Box fontSize="1.8rem" marginTop="0.2rem">
              {targetNutrition.carbohydrates || 0}
            </Box>
          </Box>

          <Box fontSize="1.5rem">carbs</Box>
        </CircularProgressLabel>
      </CircularProgress>

      <CircularProgress
        value={
          targetNutrition.fats === 0
            ? 0
            : (consumedNutrition.fats / targetNutrition.fats) * 100
        }
        size="17rem"
        trackColor="#303030"
        color="#ff704d"
      >
        <CircularProgressLabel
          display="flex"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="1rem"
          >
            <Box fontSize="2.5rem">{consumedNutrition.fats}</Box>
            <Box fontSize="1.8rem" padding="0 0.5rem 0 0.5rem">
              /
            </Box>
            <Box fontSize="1.8rem" marginTop="0.2rem">
              {targetNutrition.fats || 0}
            </Box>
          </Box>

          <Box fontSize="1.5rem">fats</Box>
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}

export default NutritionProgress;
