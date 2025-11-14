import { Vehicle, VehicleStatus } from "@/domain/entities/vehicle";
import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { db } from "../database";
import { eq } from "drizzle-orm";
import { vehicleSchema } from "../database/schemas/vehicle-schemas";
import { logger } from "@/config/logger";

export class VehicleRepositoryAdapter implements VehicleRepository {
  async getVehicleByVin(vin: string): Promise<Vehicle | null> {
    const vehicle = await db
      .select({
        id: vehicleSchema.id,
        make: vehicleSchema.make,
        model: vehicleSchema.model,
        year: vehicleSchema.year,
        vin: vehicleSchema.vin,
        price: vehicleSchema.price,
        color: vehicleSchema.color,
        status: vehicleSchema.status,
      })
      .from(vehicleSchema)
      .where(eq(vehicleSchema.vin, vin))
      .limit(1);

    if (vehicle.length === 0) {
      logger.debug({ vin }, "Vehicle not found by VIN");
      return null;
    }

    logger.debug({ vin, vehicleId: vehicle[0].id }, "Vehicle found by VIN");
    return vehicle[0] as Vehicle;
  }
  async createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicleSchema)
      .values(data)
      .returning();

    logger.debug(
      { vehicleId: newVehicle.id, vin: newVehicle.vin },
      "Vehicle inserted successfully"
    );
    return newVehicle;
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const vehicle = await db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.id, id))
      .limit(1);

    if (vehicle.length === 0) {
      logger.debug({ vehicleId: id }, "Vehicle not found by ID");
      return null;
    }

    logger.debug({ vehicleId: id, vin: vehicle[0].vin }, "Vehicle found by ID");
    return vehicle[0];
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const [updatedVehicle] = await db
      .update(vehicleSchema)
      .set(data)
      .where(eq(vehicleSchema.id, id))
      .returning();

    if (!updatedVehicle) {
      logger.debug({ vehicleId: id }, "No vehicle found to update");
      throw new Error(`Vehicle with ID ${id} not found`);
    }

    logger.debug(
      { vehicleId: id, vin: updatedVehicle.vin },
      "Vehicle updated in database"
    );
    return updatedVehicle;
  }

  async getAllVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    let query = db.select().from(vehicleSchema);

    if (status !== undefined) {
      query = query.where(eq(vehicleSchema.status, status)) as typeof query;
    }

    const vehicles = await query;

    logger.debug(
      { count: vehicles.length, status },
      "Retrieved vehicles from database"
    );
    return vehicles;
  }
}
