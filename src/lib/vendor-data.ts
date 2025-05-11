
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Vendor } from '@/types/vendor';

const VENDORS_COLLECTION = 'vendors';

export const getVendorsFirestore = async (): Promise<Vendor[]> => {
  const vendorsCollectionRef = collection(db, VENDORS_COLLECTION);
  const q = query(vendorsCollectionRef, orderBy('name', 'asc')); // Order by name
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
};

export const addVendorFirestore = async (vendor: Vendor): Promise<void> => {
  const vendorDocRef = doc(db, VENDORS_COLLECTION, vendor.id);
  await setDoc(vendorDocRef, vendor);
};

export const updateVendorFirestore = async (vendor: Vendor): Promise<void> => {
  const vendorDocRef = doc(db, VENDORS_COLLECTION, vendor.id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...vendorData } = vendor; // Firestore updateDoc doesn't want 'id' in the data payload
  await updateDoc(vendorDocRef, vendorData);
};

export const deleteVendorFirestore = async (vendorId: string): Promise<void> => {
  const vendorDocRef = doc(db, VENDORS_COLLECTION, vendorId);
  await deleteDoc(vendorDocRef);
};
