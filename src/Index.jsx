import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Link, Input, useColorMode, IconButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from 'react-icons/fa';
import axios from 'axios';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

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
    setFilteredStories(
      stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stories]);

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h1" size="lg">Hacker News Top Stories</Heading>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          aria-label="Toggle dark mode"
        />
      </Flex>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        mb={4}
      />
      {filteredStories.map(story => (
        <Box key={story.id} p={4} mb={4} borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>{story.title}</Heading>
          <Text mb={2}>Upvotes: {story.score}</Text>
          <Link href={story.url} color="teal.500" isExternal>Read more</Link>
        </Box>
      ))}
    </Box>
  );
};

export default Index;