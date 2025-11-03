import { Vehicle } from "@/domain/entities/vehicle";
import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { db } from ".";
import { eq } from "drizzle-orm";
import { vehicleSchema } from "./schemas/vehicle-schemas";

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
        isSold: vehicleSchema.isSold,
      })
      .from(vehicleSchema)
      .where(eq(vehicleSchema.vin, vin))
      .limit(1);

    if (vehicle.length === 0) return null;
    return vehicle[0] as Vehicle;
  }
  async createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicleSchema)
      .values(data)
      .returning();
    return newVehicle;
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const vehicle = await db
      .select()
      .from(vehicleSchema)
      .where(eq(vehicleSchema.id, id))
      .limit(1);

    if (vehicle.length === 0) return null;
    return vehicle[0];
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const [updatedVehicle] = await db
      .update(vehicleSchema)
      .set(data)
      .where(eq(vehicleSchema.id, id))
      .returning();

    return updatedVehicle;
  }
}
