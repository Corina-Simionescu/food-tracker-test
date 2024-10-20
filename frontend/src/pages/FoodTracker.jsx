import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NutritionProgress from "../components/NutritionProgress.jsx";
import UserIcon from "../components/UserIcon.jsx";
import FoodLog from "../components/FoodLog.jsx";
import { Box, Button, Divider } from "@chakra-ui/react";

function FoodTracker() {
  const navigate = useNavigate();
  const [nutritionPlan, setNutritionPlan] = useState({
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  });
  const [userHasNutritionPlan, setUserHasNutritionPlan] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem(
        "error",
        "You need to log in to access the Food Tracker"
      );

      navigate("/");
      return;
    }

    fetchNutritionPlan();
  }, []);

  async function fetchNutritionPlan() {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("error", "You need to sign in");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/food-tracker/nutrition`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.setItem("error", "You need to sign in");
        navigate("/");
        return;
      }

      const responseData = await response.json();

      if (response.ok) {
        setNutritionPlan({
          calories: responseData.calories,
          proteins: responseData.proteins,
          carbohydrates: responseData.carbohydrates,
          fats: responseData.fats,
        });

        if (
          responseData.calories === "0" &&
          responseData.proteins === "0" &&
          responseData.carbohydrates === "0" &&
          responseData.fats === "0"
        ) {
          setUserHasNutritionPlan(false);
        }
      } else {
        setUserHasNutritionPlan(false);
      }
    } catch (error) {
      console.error(error.message);
      setUserHasNutritionPlan(false);
    }
  }

  function updateNutritionPlan() {
    fetchNutritionPlan();
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <NutritionProgress targetNutrition={nutritionPlan}></NutritionProgress>
        <UserIcon
          updateNutritionPlan={updateNutritionPlan}
          userHasNutritionPlan={userHasNutritionPlan}
        ></UserIcon>
      </Box>

      <Button
        margin="2rem 0 0 2rem"
        fontSize="1.5rem"
        borderRadius="1.3rem"
        padding="1.5rem"
        textAlign="center"
        backgroundColor="#222222"
        textColor="#ffffff"
        border="0.05rem solid #bfbfbf"
        _hover={{
          boxShadow: "0 0 3px 3px  #737373",
        }}
        onClick={() => navigate("/food-tracker/add-food")}
      >
        Add food
      </Button>

      <Divider opacity="1" background="#ffffff" marginY="1%"></Divider>

      <FoodLog></FoodLog>
    </Box>
  );
}

export default FoodTracker;
