import React, { useState, useEffect } from 'react';
import { Box, Heading, List, ListItem, Text, Stack, Spinner, Flex, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const PopularMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMeals = async () => {
      try {
        const response = await fetch('/api/popularmeals');
        const data = await response.json();
        
        if (data.success) {
          setMeals(data.meals); // Ensure you use 'meals' here based on your API response
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular meals:', error);
        setLoading(false);
      }
    };

    fetchPopularMeals();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box p={6} maxW="900px" mx="auto" mt={8} boxShadow="lg" rounded="lg" bg="gray.50">
      <Heading as="h2" size="md" mb={6} textAlign="center" color="teal.600">
        Popular Meals Today
      </Heading>

      <List spacing={4}>
        {meals.map((meal, index) => (
          <ListItem key={index} p={4} bg="white" rounded="md" boxShadow="md" _hover={{ bg: 'gray.100' }}>
            <Flex justify="space-between" align="center">
              <Stack direction="row" align="center">
                {/* Display FaStar based on timesOrdered */}
                {meal.timesOrdered >= 5 ? (
                  <Icon as={FaStar} color="yellow.400" w={6} h={6} />
                ) : meal.timesOrdered >= 2 ? (
                  <Icon as={FaStar} color="gray.300" w={6} h={6} />
                ) : (
                  <Icon as={FaStar} color="gray.100" w={6} h={6} />
                )}
                <Stack direction="column">
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    {meal.name}
                  </Text>
                  {/* Display the prices */}
                  {meal.prices && meal.prices.length > 0 && (
                    <Text fontSize="md" color="gray.500">
                      Meal Price Orders: {meal.prices.map((price, idx) => (
                        <span key={idx}>Ksh {price} {idx < meal.prices.length - 1 ? ', ' : ''}</span>
                      ))}
                    </Text>
                  )}
                </Stack>
              </Stack>
              <Text fontSize="md" color="teal.500" fontWeight="bold">
                {meal.timesOrdered} {meal.timesOrdered === 1 ? 'order' : 'orders'}
              </Text>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PopularMeals;
