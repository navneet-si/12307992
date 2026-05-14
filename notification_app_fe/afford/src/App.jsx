import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Select, MenuItem, Button } from '@mui/material';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [readItems, setReadItems] = useState([]);

  useEffect(() => {
    let url = `http://4.224.186.213/evaluation-service/notifications?limit=10&page=${page}`;
    
    if (filter !== "") {
      url = url + `&notification_type=${filter}`;
    }

    fetch(url, {
      headers: {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    })
    .then(res => res.json())
    .then(d => {
      if (d && d.notifications) {
        setData(d.notifications);
      }
    })
    .catch(err => console.log(err));
  }, [page, filter]);

  function markAsRead(id) {
    setReadItems([...readItems, id]);
  }

  return (
    <Container style={{ marginTop: '30px', maxWidth: '600px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Notifications</Typography>
      
      <Select 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        style={{ width: '200px', marginBottom: '20px' }}
      >
        <MenuItem value="">All Notifications</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
      </Select>

      {data.map((item) => (
        <Card 
          key={item.ID} 
          style={{ 
            marginBottom: '15px', 
            borderLeft: readItems.includes(item.ID) ? 'none' : '5px solid blue',
            backgroundColor: readItems.includes(item.ID) ? '#f9f9f9' : '#ffffff' 
          }}
        >
          <CardContent>
            <Typography variant="h6">{item.Type}</Typography>
            <Typography>{item.Message}</Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
              {item.Timestamp}
            </Typography>
            
            {!readItems.includes(item.ID) && (
              <Button 
                variant="outlined" 
                size="small" 
                style={{ marginTop: '10px' }} 
                onClick={() => markAsRead(item.ID)}
              >
                Mark as read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Button 
          variant="contained" 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}

export default App;