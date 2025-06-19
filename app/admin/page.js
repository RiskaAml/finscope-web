"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pengajuanList, setPengajuanList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@finscope.com") {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, "pengajuan"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPengajuanList(data);
    });

    return () => unsubscribe();
  }, []);

  const handleApproval = async (id, status) => {
    const ref = doc(db, "pengajuan", id);
    await updateDoc(ref, { status });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        {pengajuanList.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg mb-4 bg-gray-100 dark:bg-gray-800">
            <p><strong>Nama:</strong> {item.nama}</p>
            <p><strong>Tipe:</strong> {item.tipe}</p>
            <p><strong>Alasan:</strong> {item.alasan}</p>
            <p><strong>Nominal:</strong> Rp{item.nominal}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleApproval(item.id, "Disetujui")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                Setujui
              </button>
              <button
                onClick={() => handleApproval(item.id, "Ditolak")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Tolak
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
