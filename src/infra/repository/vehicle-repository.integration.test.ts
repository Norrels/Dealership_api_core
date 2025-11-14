import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { VehicleRepositoryAdapter } from "@/infra/repository/vehicle-repository.adapter";
import { VehicleFactory } from "../../tests/factories/vehicle.factory";
import { cleanDatabase } from "../../tests/setup";

describe("VehicleRepositoryAdapter - Integration Tests", () => {
  let repository: VehicleRepositoryAdapter;

  beforeEach(async () => {
    repository = new VehicleRepositoryAdapter();
    await cleanDatabase();
  });

  describe("createVehicle", () => {
    it("should create a vehicle and return it with an id", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();

      const result = await repository.createVehicle(vehicleData);

      expect(result.id).toBeDefined();
      expect(result.make).toBe(vehicleData.make);
      expect(result.model).toBe(vehicleData.model);
      expect(result.year).toBe(vehicleData.year);
      expect(result.vin).toBe(vehicleData.vin);
      expect(result.color).toBe(vehicleData.color);
      expect(result.price).toBe(vehicleData.price);
      expect(result.status).toBe(vehicleData.status);
    });

    it("should generate a unique id for each vehicle", async () => {
      const vehicle1Data = VehicleFactory.createVehicleInput();
      const vehicle2Data = VehicleFactory.createVehicleInput();

      const result1 = await repository.createVehicle(vehicle1Data);
      const result2 = await repository.createVehicle(vehicle2Data);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("getVehicleById", () => {
    it("should return vehicle when found", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const created = await repository.createVehicle(vehicleData);

      const result = await repository.getVehicleById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.vin).toBe(vehicleData.vin);
    });

    it("should return null when vehicle not found", async () => {
      const result = await repository.getVehicleById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("getVehicleByVin", () => {
    it("should return vehicle when VIN is found", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const created = await repository.createVehicle(vehicleData);

      const result = await repository.getVehicleByVin(vehicleData.vin);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.vin).toBe(vehicleData.vin);
    });

    it("should return null when VIN not found", async () => {
      const result = await repository.getVehicleByVin("NONEXISTENTVINNNN");

      expect(result).toBeNull();
    });

    it("should only return vehicle with exact VIN match", async () => {
      const vehicle1Data = VehicleFactory.createVehicleInput();
      const vehicle2Data = VehicleFactory.createVehicleInput();

      await repository.createVehicle(vehicle1Data);
      await repository.createVehicle(vehicle2Data);

      const result = await repository.getVehicleByVin(vehicle1Data.vin);

      expect(result).not.toBeNull();
      expect(result?.vin).toBe(vehicle1Data.vin);
      expect(result?.vin).not.toBe(vehicle2Data.vin);
    });
  });

  describe("updateVehicle", () => {
    it("should update vehicle and return updated data", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const created = await repository.createVehicle(vehicleData);

      const updateData = {
        make: "Updated Make",
        model: "Updated Model",
        color: "Red",
      };

      const result = await repository.updateVehicle(created.id, updateData);

      expect(result.id).toBe(created.id);
      expect(result.make).toBe("Updated Make");
      expect(result.model).toBe("Updated Model");
      expect(result.color).toBe("Red");
      expect(result.year).toBe(vehicleData.year);
      expect(result.vin).toBe(vehicleData.vin);
    });

    it("should update only provided fields", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const created = await repository.createVehicle(vehicleData);

      const result = await repository.updateVehicle(created.id, {
        color: "Blue",
      });

      expect(result.color).toBe("Blue");
      expect(result.make).toBe(vehicleData.make);
      expect(result.model).toBe(vehicleData.model);
    });

    it("should update vehicle status", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const created = await repository.createVehicle(vehicleData);

      const result = await repository.updateVehicle(created.id, {
        status: "sold",
      });

      expect(result.status).toBe("sold");
    });

    it("should throw error when vehicle not found", async () => {
      expect(
        repository.updateVehicle("non-existent-id", { make: "Test" })
      ).rejects.toThrow("Vehicle with ID non-existent-id not found");
    });

    it("should update VIN when provided", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const created = await repository.createVehicle(vehicleData);
      const newVin = VehicleFactory.generateVIN();

      const result = await repository.updateVehicle(created.id, {
        vin: newVin,
      });

      expect(result.vin).toBe(newVin);
    });
  });

  describe("Data Integrity", () => {
    it("should preserve all fields during create", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        make: "Toyota",
        model: "Camry",
        year: 2023,
        color: "Silver",
        price: "30000.50",
        status: "sold",
      });

      const result = await repository.createVehicle(vehicleData);

      expect(result.make).toBe("Toyota");
      expect(result.model).toBe("Camry");
      expect(result.year).toBe(2023);
      expect(result.color).toBe("Silver");
      expect(result.price).toBe("30000.50");
      expect(result.status).toBe("sold");
    });

    it("should handle decimal prices correctly", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        price: "12345.67",
      });

      const result = await repository.createVehicle(vehicleData);

      expect(result.price).toBe("12345.67");
    });

    it("should handle vehicle status correctly", async () => {
      const soldVehicle = VehicleFactory.createVehicleInput({ status: "sold" });
      const availableVehicle = VehicleFactory.createVehicleInput({
        status: "available",
      });

      const result1 = await repository.createVehicle(soldVehicle);
      const result2 = await repository.createVehicle(availableVehicle);

      expect(result1.status).toBe("sold");
      expect(result2.status).toBe("available");
    });
  });

  describe("VIN Uniqueness", () => {
    it("should enforce VIN uniqueness constraint", async () => {
      const vin = VehicleFactory.generateVIN();
      const vehicle1Data = VehicleFactory.createVehicleInput({ vin });
      const vehicle2Data = VehicleFactory.createVehicleInput({ vin }); // Same VIN

      await repository.createVehicle(vehicle1Data);

      expect(repository.createVehicle(vehicle2Data)).rejects.toThrow();
    });
  });
});
