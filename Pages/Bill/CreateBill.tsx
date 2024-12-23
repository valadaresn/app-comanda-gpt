import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { BillSchema, Bill } from '../../Models/BillSchema';
import { TableSchema, Table } from '../../Models/TableSchema';
import { listenToCollection } from '../../FirebaseService';
import { createBill } from '../../Redux/BillSlice';
import { collectionNames } from '../../firebaseConfig';

const CreateBill = () => {
  const dispatch = useDispatch();
  const [tables, setTables] = useState<Table[]>([]);
  const defaultValues = BillSchema.parse({});
 
  const { register, handleSubmit, formState: { errors } } = useForm<Bill>({
    resolver: zodResolver(BillSchema),
    defaultValues,
  });

  // Busca as mesas livres ao montar o componente
  useEffect(() => {
    
    const unsubscribe = listenToCollection(collectionNames.tables, (data) => {
      const freeTables = data.filter((table: Table) => table.status === "Free");
      setTables(freeTables);
    });

    return () => unsubscribe();
  }, []);

  // Manipula o clique em uma mesa para criar a comanda
  const handleTableClick = (tableId: number) => {
    handleSubmit((data) => {
      try {
        const bill = BillSchema.parse({
          ...data,
          tableId,
        });
        dispatch(createBill(bill));
      } catch (error) {
        console.error("Erro ao validar a comanda:", error);
        alert("Erro ao criar a comanda. Verifique os dados e tente novamente.");
      }
    })();
  };

  return (
    <div>
      {/* Renderização do formulário e das mesas */}
    </div>
  );
};

export default CreateBill;