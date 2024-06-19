import React, { useState, useEffect } from 'react';
import { Box, Text, Link, Flex, Input, useColorMode, Button } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(ids => {
        const top5Ids = ids.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        ));
      })
      .then(stories => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch(error => console.error('Error fetching stories:', error));
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
        <Text fontSize="2xl" fontWeight="bold">Hacker News Top Stories</Text>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Flex>
      <Input 
        placeholder="Search stories..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        mb={4}
      />
      {filteredStories.map(story => (
        <Box key={story.id} p={4} shadow="md" borderWidth="1px" mb={4}>
          <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
          <Link href={story.url} color="teal.500" isExternal>Read more</Link>
          <Text mt={2}>Upvotes: {story.score}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default Index;