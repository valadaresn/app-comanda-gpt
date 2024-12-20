import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';

function BillDetails() {
  const bill = useSelector((state: any) => state.bill.bill);
  const items = useSelector((state: any) => state.bill.items);
  const loading = useSelector((state: any) => state.bill.loading);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Detalhes da Fatura
      </Typography>
      <Typography variant="h6" gutterBottom>
        ID da Fatura: {bill?.id}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1" fontWeight="bold">
                  R$ {item.price.toFixed(2)}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                fullWidth
              >
                Ver Detalhes
              </Button>
              {!item.isCanceled && (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => handleCancelItem(item.id)}
                >
                  Cancelar
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BillDetails;