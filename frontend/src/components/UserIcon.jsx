import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
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
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";

function UserIcon({ updateNutritionPlan, userHasNutritionPlan }) {
  const navigate = useNavigate();
  const {
    isOpen: isNutritionPlanModalOpen,
    onOpen: onNutritionPlanModalOpen,
    onClose: onNutritionPlanModalClose,
  } = useDisclosure();
  const toast = useToast();
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [gender, setGender] = useState("");
  const [workoutFrequency, setWorkoutFrequency] = useState("");
  const [workoutIntensity, setWorkoutIntensity] = useState("");
  const [dailyActivity, setDailyActivity] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (userHasNutritionPlan === false) {
      onNutritionPlanModalOpen();
    }
  }, [userHasNutritionPlan]);

  function calculateRestingEnergyExpenditure() {
    let ree;

    if (gender === "man") {
      ree = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "women") {
      ree = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    return ree;
  }

  function calculateActivityFactor() {
    //                                    Workout Factors Data
    // | Intensity / Frequency | Rarely (0-1) | Sometimes (2-3) | Often (4-5) | Very Often (6-7) |
    // |-----------------------|--------------|-----------------|-------------|------------------|
    // | Light                 | 1.2          | 1.3             | 1.4         | 1.5              |
    // | Moderate              | 1.3          | 1.5             | 1.6         | 1.7              |
    // | Hard                  | 1.4          | 1.6             | 1.8         | 1.9              |
    // | Very Hard             | 1.5          | 1.7             | 1.9         | 2.0              |

    const workoutFactorsData = {
      rarely: {
        light: 1.2,
        moderate: 1.3,
        hard: 1.4,
        veryHard: 1.5,
      },
      sometimes: {
        light: 1.3,
        moderate: 1.5,
        hard: 1.6,
        veryHard: 1.7,
      },
      often: {
        light: 1.4,
        moderate: 1.6,
        hard: 1.8,
        veryHard: 1.9,
      },
      veryOften: {
        light: 1.5,
        moderate: 1.7,
        hard: 1.9,
        veryHard: 2.0,
      },
    };

    //   Daily Activity Factors Data
    // | Activity Level | Factor |
    // -----------------|--------|
    // | Sedentary      | 1.2    |
    // | Light          | 1.3    |
    // | Moderate       | 1.4    |
    // | Very           | 1.5    |
    // | Extreme        | 1.6    |

    const dailyActivityFactorsData = {
      sedentary: 1.2,
      light: 1.3,
      moderate: 1.4,
      very: 1.5,
      extreme: 1.6,
    };

    const workoutFactor =
      workoutFactorsData[workoutFrequency][workoutIntensity];
    const dailyActivityFactor = dailyActivityFactorsData[dailyActivity];

    const activityFactor = (workoutFactor * 2 + dailyActivityFactor) / 3;

    return activityFactor;
  }

  function calcuteTotalDailyEnergyExpenditure() {
    const ree = calculateRestingEnergyExpenditure();
    const activityFactor = calculateActivityFactor();

    const tdee = ree * activityFactor;

    return tdee;
  }

  function calculateCalories() {
    const tdee = calcuteTotalDailyEnergyExpenditure();
    let calories;

    if (goal === "loseWeight") {
      calories = tdee - 500;
    } else if (goal === "maintainWeight") {
      calories = tdee;
    } else if (goal == "gainWeight") {
      calories = tdee + 300;
    }

    return Math.round(calories);
  }

  function calculateMacronutrients(calories) {
    let proteins, fats, carbohydrates;

    if (goal === "loseWeight") {
      proteins = 2.2 * weight;
      fats = ((25 / 100) * calories) / 9;
    } else if (goal === "maintainWeight") {
      proteins = 1.8 * weight;
      fats = ((30 / 100) * calories) / 9;
    } else if (goal == "gainWeight") {
      proteins = 2.0 * weight;
      fats = ((30 / 100) * calories) / 9;
    }

    carbohydrates = (calories - (proteins * 4 + fats * 9)) / 4;

    proteins = Math.round(proteins);
    fats = Math.round(fats);
    carbohydrates = Math.round(carbohydrates);

    return { proteins, fats, carbohydrates };
  }

  function calculateNutritionPlan() {
    const calories = calculateCalories();
    const { proteins, fats, carbohydrates } = calculateMacronutrients(calories);

    return { calories, proteins, fats, carbohydrates };
  }

  async function sendNutritionPlanToServer(
    calories,
    proteins,
    fats,
    carbohydrates
  ) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem(
          "error",
          "You need to sign in to generate a nutrition plan"
        );
        navigate("/");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/food-tracker/nutrition`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            calories,
            proteins,
            fats,
            carbohydrates,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.setItem(
          "error",
          "You need to sign in to generate a nutrition plan"
        );
        navigate("/");
        return;
      }

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: responseData.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onNutritionPlanModalClose();
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
      toast({
        title: "Unexpected Error",
        description: responseData.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { calories, proteins, fats, carbohydrates } =
      calculateNutritionPlan();
    sendNutritionPlanToServer(calories, proteins, fats, carbohydrates);

    updateNutritionPlan();
  }

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Box}
          cursor="pointer"
          height="3rem"
          width="3rem"
          margin="0.5rem 0.5rem 0 0"
          borderRadius="full"
          _hover={{
            boxShadow: "0 0 3px 3px  #737373",
          }}
        >
          <Avatar
            backgroundColor="#222222"
            icon={<AiOutlineUser fontSize="1.7rem" color="#ffffff" />}
          ></Avatar>
        </MenuButton>
        <MenuList
          backgroundColor="#222222"
          border="0.05rem solid #bfbfbf"
          boxShadow="0 0 2px 2px #737373"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <MenuItem
            backgroundColor="#222222"
            textColor="#ffffff"
            borderRadius="0.5rem"
            marginY="0.2rem"
            width="95%"
            _hover={{
              backgroundColor: "#333333",
            }}
            onClick={onNutritionPlanModalOpen}
          >
            Generate Plan
          </MenuItem>
          <MenuItem
            backgroundColor="#222222"
            textColor="#ffffff"
            borderRadius="0.5rem"
            marginY="0.2rem"
            width="95%"
            _hover={{
              backgroundColor: "#333333",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal
        isOpen={isNutritionPlanModalOpen}
        onClose={onNutritionPlanModalClose}
      >
        <ModalOverlay></ModalOverlay>

        <ModalContent
          backgroundColor="#404040"
          textColor="#ffffff"
          maxWidth="50rem"
          padding="1rem"
          border="0.05rem solid #bfbfbf"
          boxShadow="0 0 3px 3px  #737373"
        >
          <ModalHeader textAlign="center" fontSize="1.5rem">
            Personalized Calories & Macronutrients Calculator
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>

          <form onSubmit={handleSubmit}>
            <ModalBody display="flex" flexDirection="column" gap="1.5rem">
              <FormControl isRequired>
                <FormLabel htmlFor="age">Age (years)</FormLabel>
                <NumberInput
                  id="age"
                  name="age"
                  min={0}
                  onChange={(value) => setAge(value)}
                  value={age}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                    <NumberDecrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="weight">Weight (kg)</FormLabel>
                <NumberInput
                  id="weight"
                  name="weight"
                  min={0}
                  onChange={(value) => setWeight(value)}
                  value={weight}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                    <NumberDecrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="height">Height (cm)</FormLabel>
                <NumberInput
                  id="height"
                  name="height"
                  min={0}
                  onChange={(value) => setHeight(value)}
                  value={height}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                    <NumberDecrementStepper
                      color="#ffffff"
                      _active={{ backgroundColor: "#222222" }}
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  name="gender"
                  onChange={(value) => setGender(value)}
                  value={gender}
                >
                  <Stack direction="row">
                    <Radio value="man">Man</Radio>
                    <Radio value="women">Woman</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Workout frequency</FormLabel>
                <RadioGroup
                  name="workoutFrequency"
                  onChange={(value) => setWorkoutFrequency(value)}
                  value={workoutFrequency}
                >
                  <Stack direction="column">
                    <Radio value="rarely">Rarely (0-1 days/week)</Radio>
                    <Radio value="sometimes">Sometimes (2-3 days/week)</Radio>
                    <Radio value="often">Often (4-5 days per week)</Radio>
                    <Radio value="veryOften">
                      Very often (6-7 days per week)
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Workout intensity</FormLabel>
                <RadioGroup
                  name="workoutIntensity"
                  onChange={(value) => setWorkoutIntensity(value)}
                  value={workoutIntensity}
                >
                  <Stack direction="column">
                    <Radio value="light">Light (e.g., walking, yoga)</Radio>
                    <Radio value="moderate">
                      Moderate (e.g., jogging, recreational sports, moderate
                      strength training)
                    </Radio>
                    <Radio value="hard">
                      Hard (e.g., intense cardio, heavy strength training)
                    </Radio>
                    <Radio value="veryHard">
                      Very hard (e.g., professional athlete training)
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Daily activity</FormLabel>
                <RadioGroup
                  name="dailyActivity"
                  onChange={(value) => setDailyActivity(value)}
                  value={dailyActivity}
                >
                  <Stack direction="column">
                    <Radio value="sedentary">
                      Sedentary (Mostly sitting: e.g. desk job)
                    </Radio>
                    <Radio value="light">
                      Lightly Active (Mostly standing or walking: e.g. teacher,
                      retail)
                    </Radio>
                    <Radio value="moderate">
                      Moderately Active (Regular movement, some physical tasks:
                      e.g. waiter, mailman)
                    </Radio>
                    <Radio value="very">
                      Very Active (Mostly moving, regular physical tasks: e.g
                      housekeeper, gardener)
                    </Radio>
                    <Radio value="extreme">
                      Extremely Active (Constant movement, heavy physical tasks:
                      e.g. construction worker, firefighter)
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Your Goal</FormLabel>
                <RadioGroup
                  name="goal"
                  onChange={(value) => setGoal(value)}
                  value={goal}
                >
                  <Stack direction="column">
                    <Radio value="loseWeight">Lose weight</Radio>
                    <Radio value="maintainWeight">Maintain weight</Radio>
                    <Radio value="gainWeight">Gain weight (build muscle)</Radio>
                  </Stack>
                </RadioGroup>
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
              <Button type="submit">Submit</Button>
              <Button onClick={onNutritionPlanModalClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default UserIcon;
