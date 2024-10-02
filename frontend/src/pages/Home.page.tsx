import { useState, useEffect } from 'react';
import { NativeSelect, Container, SimpleGrid, Space, Notification, Table, TableData, Button } from '@mantine/core';
import axios from 'axios';

interface EnvironmentItem {
  name: string;
  url: string;
}

interface Environments {
  [key: string]: EnvironmentItem[];
}

interface TitleAndSubtitle {
  title: string;
  subtitle: string;
}

export function HomePage() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('test');
  const [titleAndSubtitle, setTitleAndSubtitle] = useState<TitleAndSubtitle | null>(null);
  const [environmentData, setEnvironmentData] = useState<Environments | null>(null);

  const handleEnvironmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEnvironment(event.currentTarget.value);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    const fetchTitleAndSubtitle = async () => {
        const response = await axios.get<TitleAndSubtitle>('http://localhost:7956/api/title_and_subtitle');
        setTitleAndSubtitle(response.data);
    };
    fetchTitleAndSubtitle();
  }, []);

  useEffect(() => {
    const fetchEnvironments = async () => {
        const response = await axios.get<Environments>('http://localhost:7956/api/environments');
        setEnvironmentData(response.data);
    };
    fetchEnvironments();
  }, []);

  const environmentUrls: EnvironmentItem[] = environmentData?.[selectedEnvironment] || [];

  const tableData: TableData = {
    head: [
      <th key="name">Name</th>,
      <th key="url">URL</th>,
      <th key="open">Open</th>,
    ],
    body: environmentUrls.map((item) => [
      <td key={item.name}>{item.name}</td>,
      <td key={item.url}>{item.url}</td>,
      <td key={`${item.name}-open`}>
        <Button
          variant="outline"
          onClick={() => openUrl(item.url)}
        >
          Open
        </Button>
      </td>,
    ]),
  };

  return (
    <>
      <Space h="xl" />
      <Container size='xl'>
        <SimpleGrid cols={2} spacing="xs">
            <Notification withBorder withCloseButton={false} title={titleAndSubtitle?.title || "Default title"}>
              {titleAndSubtitle?.subtitle || "Default Subtitle"}
            </Notification>

           <NativeSelect
              label="Select environment"
              description="Choose for which environments to show URLs"
              data={['test','preprod','prod']}
              value={selectedEnvironment}
              onChange={handleEnvironmentChange}
            />
        </SimpleGrid>

        <Space h="xl" />
        <Space h="xl" />


        <Table withTableBorder withColumnBorders data={tableData} />
      </Container>
    </>
  );
}
