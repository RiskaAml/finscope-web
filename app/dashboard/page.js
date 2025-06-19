"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pengajuanList, setPengajuanList] = useState([]);

  // form states
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("Reimbursement");
  const [alasan, setAlasan] = useState("");
  const [nominal, setNominal] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "pengajuan"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPengajuanList(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "pengajuan"), {
      nama,
      tipe,
      alasan,
      nominal,
      userId: user.uid,
      status: "Menunggu",
      createdAt: new Date()
    });
    setNama("");
    setTipe("Reimbursement");
    setAlasan("");
    setNominal("");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Halo, {user?.email} 👋
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
          <input
            type="text"
            placeholder="Nama Pengajuan"
            className="w-full px-4 py-2 rounded-lg text-black"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-2 rounded-lg text-black"
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
          >
            <option value="Reimbursement">Reimbursement</option>
            <option value="Permintaan Dana">Permintaan Dana</option>
          </select>
          <input
            type="text"
            placeholder="Alasan"
            className="w-full px-4 py-2 rounded-lg text-black"
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Nominal"
            className="w-full px-4 py-2 rounded-lg text-black"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Ajukan
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Riwayat Pengajuan</h2>
          <ul className="space-y-2">
            {pengajuanList.map((item) => (
              <li key={item.id} className="border p-4 rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white">
                <p><strong>{item.nama}</strong> - {item.tipe}</p>
                <p>Rp{item.nominal}</p>
                <p>{item.alasan}</p>
                <p>Status: <span className="font-semibold">{item.status}</span></p>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-full"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
