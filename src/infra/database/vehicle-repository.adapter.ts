import { Vehicle } from "@/domain/entities/vehicle";
import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { db } from ".";
import { eq } from "drizzle-orm";
import { vehicleSchemma } from "./schemas/vehicle-schemas";

export class VehicleRepositoryAdapter implements VehicleRepository {
  async getVehicleByVin(vin: string): Promise<Vehicle | null> {
    const vehicle = await db
      .select()
      .from(vehicleSchemma)
      .where(eq(vehicleSchemma.vin, vin))
      .limit(1);

    if (vehicle.length === 0) return null;
    return vehicle[0];
  }
  async createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicleSchemma)
      .values(data)
      .returning();
    return newVehicle;
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const vehicle = await db
      .select()
      .from(vehicleSchemma)
      .where(eq(vehicleSchemma.id, Number(id)))
      .limit(1);

    if (vehicle.length === 0) return null;
    return vehicle[0];
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const [updatedVehicle] = await db
      .update(vehicleSchemma)
      .set(data)
      .where(eq(vehicleSchemma.id, Number(id)))
      .returning();

    return updatedVehicle;
  }
}
