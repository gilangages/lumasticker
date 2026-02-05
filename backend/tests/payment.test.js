const request = require("supertest");
const express = require("express");

// --- 1. SETUP MOCK MIDTRANS (TEKNIK EXPOSED MOCK) ---
jest.mock("midtrans-client", () => {
  // Buat mock function DI DALAM factory supaya aman dari error initialization
  const mockFunc = jest.fn().mockResolvedValue({
    token: "TOKEN-PALSU-DARI-TEST",
    redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/TOKEN-PALSU",
  });

  return {
    Snap: jest.fn().mockImplementation(() => {
      return {
        // Setiap kali backend panggil new Snap(), dia dapet object ini
        createTransaction: mockFunc,
      };
    }),
    // RAHASIA: Kita tempel function ini di sini supaya bisa diakses dari luar
    __mockCreateTransaction: mockFunc,
  };
});

// --- 2. SETUP MOCK DATABASE ---
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));

// --- 3. IMPORT MODUL ---
// Ambil mock function yang sudah kita "tempel" tadi
const midtransClient = require("midtrans-client");
const createTransactionMock = midtransClient.__mockCreateTransaction;
const db = require("../config/database");

// Load Routes (ini akan mentrigger 'new Snap()' di controller)
const paymentRoutes = require("../routes/paymentRoutes");

const app = express();
app.use(express.json());
app.use("/api/payment", paymentRoutes);

describe("Payment Controller Logic", () => {
  beforeEach(() => {
    // Reset histori panggilan function sebelum tiap test
    // Sekarang aman karena createTransactionMock diambil langsung dari sumbernya
    createTransactionMock.mockClear();
    db.query.mockClear();
  });

  // --- TEST CASE 1: BERHASIL MEMBUAT TRANSAKSI ---
  it("Harus berhasil membuat token transaksi (200 OK)", async () => {
    // Mock Database: Produk Ditemukan
    db.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: "Stiker Luma",
          price: 15000,
        },
      ],
    ]);
    // Mock Database: Insert Transaksi Sukses
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    // Kirim Request
    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 1,
      customer_name: "Tester Ganteng",
      customer_email: "test@example.com",
    });

    // Verifikasi
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("TOKEN-PALSU-DARI-TEST");

    // Cek apakah Midtrans dipanggil dengan parameter yang benar
    expect(createTransactionMock).toHaveBeenCalledTimes(1);
    expect(createTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction_details: expect.objectContaining({
          gross_amount: 15000,
        }),
        customer_details: expect.objectContaining({
          email: "test@example.com",
        }),
      }),
    );
  });

  // --- TEST CASE 2: PRODUK TIDAK DITEMUKAN ---
  it("Harus gagal jika produk tidak ada di database (404)", async () => {
    // Mock Database: Produk Kosong (Array kosong dalam array)
    db.query.mockResolvedValueOnce([[]]);

    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 999,
      customer_name: "User Nyasar",
      customer_email: "nyasar@example.com",
    });

    expect(res.statusCode).toEqual(404);

    // Pastikan Midtrans TIDAK dipanggil sama sekali
    expect(createTransactionMock).not.toHaveBeenCalled();
  });

  // --- TEST CASE 3: HARGA FORMAT STRING ---
  it("Harus tetap jalan walaupun harga di database format string", async () => {
    // Mock Database: Harga String
    db.query.mockResolvedValueOnce([
      [
        {
          id: 2,
          name: "Stiker Mahal",
          price: "20000.00",
        },
      ],
    ]);
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);

    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 2,
      customer_name: "Tester",
      customer_email: "test@example.com",
    });

    expect(res.statusCode).toEqual(200);

    // Cek apakah Midtrans menerima angka (20000), bukan string
    const params = createTransactionMock.mock.calls[0][0];
    expect(params.transaction_details.gross_amount).toBe(20000);
  });
});
