
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Customer } from '@/types/customer';

const CUSTOMERS_COLLECTION = 'customers';

export const getCustomersFirestore = async (): Promise<Customer[]> => {
  const customersCollectionRef = collection(db, CUSTOMERS_COLLECTION);
  const q = query(customersCollectionRef, orderBy('name', 'asc')); // Order by name
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
};

export const addCustomerFirestore = async (customer: Customer): Promise<void> => {
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await setDoc(customerDocRef, customer);
};

export const updateCustomerFirestore = async (customer: Customer): Promise<void> => {
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...customerData } = customer; // Firestore updateDoc doesn't want 'id' in the data payload
  await updateDoc(customerDocRef, customerData);
};

export const deleteCustomerFirestore = async (customerId: string): Promise<void> => {
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  await deleteDoc(customerDocRef);
};
