import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Container, TextField, Button, Typography, Grid, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BillSchema, Bill } from '../../Models/BillSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { closeBill, calculateFinalValue } from '../../Redux/BillSlice';

interface CheckoutBillProps {
  db: any;
}

function CheckoutBill({ db }: CheckoutBillProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
    
  const { register, handleSubmit, watch } = useForm<Bill>({
    resolver: zodResolver(BillSchema),
  });
  const bill = useSelector((state: any) => state.bill.bill);
  const loading = useSelector((state: any) => state.bill.loading);

  const discount = watch('discount');
  const serviceCharge = watch('serviceCharge');
  const subTotal = bill?.subTotal || 0;

  useEffect(() => {
    dispatch(calculateFinalValue());
  }, [discount, serviceCharge, subTotal, dispatch]);

  const onSubmit = async (data: Bill) => {
    try {
      await dispatch(closeBill(db, id, data));
      navigate('/bills/open');
    } catch (error) {
      console.error('Erro ao encerrar a comanda:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Encerrar Comanda
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('tableNumber')}
              label="Mesa Selecionada"
              type="number"
              fullWidth
              value={bill?.tableNumber || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('subTotal')}
              label="Subtotal"
              type="number"
              fullWidth
              value={subTotal}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox {...register('applyDiscount')} />}
              label="Aplicar Desconto"
            />
          </Grid>
          {bill?.applyDiscount && (
            <Grid item xs={12}>
              <TextField
                {...register('discount')}
                label="Desconto (%)"
                type="number"
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox {...register('applyServiceCharge')} />}
              label="Aplicar Taxa de Serviço"
            />
          </Grid>
          {bill?.applyServiceCharge && (
            <Grid item xs={12}>
              <TextField
                {...register('serviceCharge')}
                label="Taxa de Serviço"
                type="number"
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              {...register('finalValue')}
              label="Valor Final"
              type="number"
              fullWidth
              value={bill?.finalValue || 0}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('totalPaid')}
              label="Total Pago"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Encerrar Comanda
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default CheckoutBill;