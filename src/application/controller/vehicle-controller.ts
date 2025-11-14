import { VehicleRepositoryAdapter } from "@/infra/repository/vehicle-repository.adapter";
import Elysia from "elysia";
import { VehicleService } from "../service/vehicle-service";
import {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  VehicleParamsDTO,
  VehicleResponseDTO,
  VehicleListResponseDTO,
  VehicleQueryDTO,
  VehicleWebhookDTO,
} from "../dtos/vehicle-dto";

const repository = new VehicleRepositoryAdapter();
const service = new VehicleService(repository);

export const VehicleController = new Elysia({ prefix: "/vehicles" })
  .get(
    "",
    async ({ query }) => {
      return await service.getAllVehicles(query.status);
    },
    {
      query: VehicleQueryDTO,
      response: VehicleListResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Get all vehicles",
        description:
          "Retrieves a list of all vehicles in the dealership system. Optionally filter by status using the status query parameter ('available' for available vehicles, 'sold' for sold vehicles).",
      },
    }
  )
  .post(
    "",
    async ({ body }) => {
      return await service.createVehicle(body);
    },
    {
      body: CreateVehicleDTO,
      response: VehicleResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Register a new vehicle",
        description:
          "Creates a new vehicle in the dealership system with the provided details.",
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await service.getVehicleDetails(id);
    },
    {
      params: VehicleParamsDTO,
      response: VehicleResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Get vehicle details",
        description:
          "Retrieves detailed information about a specific vehicle using its ID.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      return await service.updateVehicle(id, body);
    },
    {
      params: VehicleParamsDTO,
      body: UpdateVehicleDTO,
      response: VehicleResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Update vehicle information",
        description:
          "Updates the details of an existing vehicle in the dealership system.",
      },
    }
  )
  .patch(
    "/:id/sold",
    async ({ params: { id } }) => {
      return await service.markVehicleAsSold(id);
    },
    {
      params: VehicleParamsDTO,
      response: VehicleResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Mark vehicle as sold",
        description:
          "Updates the status of a specific vehicle to indicate that it has been sold.",
      },
    }
  )
  .post(
    "/webhook",
    async ({ body }) => {
      return await service.changeVehicleStatus(body.vehicleId, body.status);
    },
    {
      body: VehicleWebhookDTO,
      response: VehicleResponseDTO,
      detail: {
        tags: ["Vehicles"],
        summary: "Webhook to change vehicle status",
        description:
          "Webhook endpoint to receive status change events for vehicles. Accepts vehicleId and new status ('available' or 'sold').",
      },
    }
  );
