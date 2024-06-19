import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Heading, Link, Text, Input, Switch, Flex } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from 'react-icons/fa';
import axios from 'axios';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topFiveStoryIds = topStories.data.slice(0, 5);
        const storyPromises = topFiveStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
        setFilteredStories(stories.map(story => story.data));
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ChakraProvider>
      <Box p={4} bg={isDarkMode ? 'gray.800' : 'gray.100'} color={isDarkMode ? 'white' : 'black'} minHeight="100vh">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading>Hacker News Top Stories</Heading>
          <Flex align="center">
            <SunIcon />
            <Switch ml={2} mr={2} isChecked={isDarkMode} onChange={toggleDarkMode} />
            <MoonIcon />
          </Flex>
        </Flex>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={handleSearchChange}
          mb={4}
        />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} mb={4} bg={isDarkMode ? 'gray.700' : 'white'} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={2}>{story.title}</Heading>
            <Link href={story.url} isExternal color="teal.500">Read more</Link>
            <Text mt={2}>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </Box>
    </ChakraProvider>
  );
};

export default Index;