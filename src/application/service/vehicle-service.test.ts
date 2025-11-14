import { describe, it, expect, beforeEach } from "bun:test";
import { VehicleService } from "@/application/service/vehicle-service";
import { VehicleRepositoryAdapter } from "@/infra/repository/vehicle-repository.adapter";
import { NotFoundError, ConflictError } from "@/application/errors";
import { VehicleFactory } from "@/tests/factories/vehicle.factory.test";
import { cleanDatabase } from "@/tests/setup.test";

describe("VehicleService - Unit Tests", () => {
  let service: VehicleService;
  let repository: VehicleRepositoryAdapter;

  beforeEach(async () => {
    await cleanDatabase();

    repository = new VehicleRepositoryAdapter();
    service = new VehicleService(repository);
  });

  describe("getVehicleDetails", () => {
    it("should return vehicle when found", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const createdVehicle = await repository.createVehicle(vehicleData);

      const result = await service.getVehicleDetails(createdVehicle.id);

      expect(result).toMatchObject({
        id: createdVehicle.id,
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
      });
    });

    it("should throw NotFoundError when vehicle not found", async () => {
      expect(service.getVehicleDetails("non-existent-id")).rejects.toThrow(
        NotFoundError
      );
      expect(service.getVehicleDetails("non-existent-id")).rejects.toThrow(
        "Vehicle with ID non-existent-id not found"
      );
    });
  });

  describe("createVehicle", () => {
    it("should create vehicle when VIN is unique", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();

      const result = await service.createVehicle(vehicleData);

      expect(result.id).toBeDefined();
      expect(result.vin).toBe(vehicleData.vin);
      expect(result.make).toBe(vehicleData.make);
      expect(result.model).toBe(vehicleData.model);
      expect(result.status).toBe("available");
    });

    it("should throw ConflictError when VIN already exists", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      await service.createVehicle(vehicleData);

      expect(service.createVehicle(vehicleData)).rejects.toThrow(ConflictError);
      expect(service.createVehicle(vehicleData)).rejects.toThrow(
        `Vehicle with VIN ${vehicleData.vin} already exists in the system`
      );
    });

    it("should set status to 'available' by default", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      delete (vehicleData as any).status;

      const result = await service.createVehicle(vehicleData);

      expect(result.status).toBe("available");
    });

    it("should preserve status value when provided", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({ status: "sold" });

      const result = await service.createVehicle(vehicleData);

      expect(result.status).toBe("sold");
    });
  });

  describe("updateVehicle", () => {
    it("should update vehicle when it exists", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const createdVehicle = await repository.createVehicle(vehicleData);

      const updateData = { make: "Honda", model: "Civic" };
      const result = await service.updateVehicle(createdVehicle.id, updateData);

      expect(result.make).toBe("Honda");
      expect(result.model).toBe("Civic");
      expect(result.vin).toBe(vehicleData.vin);
    });

    it("should throw NotFoundError when vehicle does not exist", async () => {
      expect(
        service.updateVehicle("non-existent-id", { make: "Honda" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should allow updating VIN to a different unique value", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const createdVehicle = await repository.createVehicle(vehicleData);
      const newVin = VehicleFactory.generateVIN();

      const result = await service.updateVehicle(createdVehicle.id, {
        vin: newVin,
      });

      expect(result.vin).toBe(newVin);
    });

    it("should throw ConflictError when updating VIN to existing one", async () => {
      const vehicle1Data = VehicleFactory.createVehicleInput();
      const vehicle2Data = VehicleFactory.createVehicleInput();

      const vehicle1 = await repository.createVehicle(vehicle1Data);
      await repository.createVehicle(vehicle2Data);

      expect(
        service.updateVehicle(vehicle1.id, { vin: vehicle2Data.vin })
      ).rejects.toThrow(ConflictError);
      expect(
        service.updateVehicle(vehicle1.id, { vin: vehicle2Data.vin })
      ).rejects.toThrow(
        `Vehicle with VIN ${vehicle2Data.vin} already exists in the system`
      );
    });

    it("should not check VIN uniqueness when VIN is not being updated", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const createdVehicle = await repository.createVehicle(vehicleData);

      const result = await service.updateVehicle(createdVehicle.id, {
        make: "Honda",
      });

      expect(result.make).toBe("Honda");
      expect(result.vin).toBe(vehicleData.vin);
    });

    it("should not check VIN uniqueness when VIN is same as current", async () => {
      const vehicleData = VehicleFactory.createVehicleInput();
      const createdVehicle = await repository.createVehicle(vehicleData);

      const result = await service.updateVehicle(createdVehicle.id, {
        vin: createdVehicle.vin,
        make: "Updated Make",
      });

      expect(result.make).toBe("Updated Make");
      expect(result.vin).toBe(createdVehicle.vin);
    });
  });

  describe("markVehicleAsSold", () => {
    it("should mark vehicle as sold when it exists and is available", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createdVehicle = await repository.createVehicle(vehicleData);

      const result = await service.markVehicleAsSold(createdVehicle.id);

      expect(result.status).toBe("sold");
      expect(result.id).toBe(createdVehicle.id);
    });

    it("should throw NotFoundError when vehicle does not exist", async () => {
      expect(service.markVehicleAsSold("non-existent-id")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ConflictError when vehicle is already sold", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({ status: "sold" });
      const soldVehicle = await repository.createVehicle(vehicleData);

      expect(service.markVehicleAsSold(soldVehicle.id)).rejects.toThrow(
        ConflictError
      );
      expect(service.markVehicleAsSold(soldVehicle.id)).rejects.toThrow(
        `Vehicle with ID ${soldVehicle.id} is already marked as sold`
      );
    });

    it("should persist sold status in database", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createdVehicle = await repository.createVehicle(vehicleData);

      await service.markVehicleAsSold(createdVehicle.id);

      const vehicleFromDb = await repository.getVehicleById(createdVehicle.id);
      expect(vehicleFromDb?.status).toBe("sold");
    });
  });

  describe("getAllVehicles", () => {
    it("should return all vehicles when no status filter is provided", async () => {
      const vehicle1 = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const vehicle2 = VehicleFactory.createVehicleInput({ status: "sold" });
      const vehicle3 = VehicleFactory.createVehicleInput({
        status: "available",
      });

      await repository.createVehicle(vehicle1);
      await repository.createVehicle(vehicle2);
      await repository.createVehicle(vehicle3);

      const result = await service.getAllVehicles();

      expect(result).toHaveLength(3);
    });

    it("should filter vehicles by status when status is provided", async () => {
      const availableVehicle = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const soldVehicle = VehicleFactory.createVehicleInput({ status: "sold" });

      await repository.createVehicle(availableVehicle);
      await repository.createVehicle(soldVehicle);

      const result = await service.getAllVehicles("available");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("available");
    });
  });

  describe("changeVehicleStatus", () => {
    it("should change vehicle status when status is different", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createdVehicle = await repository.createVehicle(vehicleData);

      const result = await service.changeVehicleStatus(
        createdVehicle.id,
        "sold"
      );

      expect(result.status).toBe("sold");
    });

    it("should throw NotFoundError when vehicle does not exist", async () => {
      expect(
        service.changeVehicleStatus("non-existent-id", "sold")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when trying to set same status", async () => {
      const vehicleData = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createdVehicle = await repository.createVehicle(vehicleData);

      expect(
        service.changeVehicleStatus(createdVehicle.id, "available")
      ).rejects.toThrow(ConflictError);
      expect(
        service.changeVehicleStatus(createdVehicle.id, "available")
      ).rejects.toThrow(
        `Vehicle with ID ${createdVehicle.id} already has status 'available'`
      );
    });
  });
});
