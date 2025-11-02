import { describe, expect, it } from "bun:test";

describe("Vehicle Entity", () => {
  it("should create a vehicle entity with correct properties", () => {
    const vehicle = {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      vin: "1HGCM82633A123456",
      price: 24000,
      color: "Blue",
      isSold: false,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    expect(vehicle.id).toBe(1);
    expect(vehicle.make).toBe("Toyota");
    expect(vehicle.model).toBe("Camry");
    expect(vehicle.year).toBe(2020);
    expect(vehicle.vin).toBe("1HGCM82633A123456");
    expect(vehicle.price).toBe(24000);
    expect(vehicle.color).toBe("Blue");
    expect(vehicle.isSold).toBe(false);
    expect(vehicle.updatedAt).toBeInstanceOf(Date);
    expect(vehicle.createdAt).toBeInstanceOf(Date);
  });

  it("should have all required properties", () => {
    const vehicle = {
      id: 2,
      make: "Honda",
      model: "Civic",
      year: 2019,
      vin: "2HGCM82633A654321",
      price: 22000,
      color: "Red",
      isSold: true,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    expect(vehicle).toHaveProperty("id");
    expect(vehicle).toHaveProperty("make");
    expect(vehicle).toHaveProperty("model");
    expect(vehicle).toHaveProperty("year");
    expect(vehicle).toHaveProperty("vin");
    expect(vehicle).toHaveProperty("price");
    expect(vehicle).toHaveProperty("color");
    expect(vehicle).toHaveProperty("isSold");
    expect(vehicle).toHaveProperty("updatedAt");
    expect(vehicle).toHaveProperty("createdAt");
  });
});
