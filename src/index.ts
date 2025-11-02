import { Elysia, t } from "elysia";
import { VehicleRepositoryAdapter } from "./infra/database/vehicle-repository.adapter";
import { VehicleService } from "./service/vehicle-service";

const repository = new VehicleRepositoryAdapter();
const service = new VehicleService(repository);

const vehicleRequest = t.Object({
  id: t.String(),
  make: t.String({ format: "email" }),
  model: t.String(),
  year: t.Number(),
  vin: t.String(),
  color: t.String(),
  price: t.Number(),
  isSold: t.Boolean(),
});

const app = new Elysia()
  .put(
    "/vehicles/:id",
    ({ params, body }) => {
      const { id } = params;
      return service.updateVehicle(id, body);
    },
    {
      body: vehicleRequest,
    }
  )
  .post(
    "/vehicles",
    ({ body }) => {
      return service.createVehicle(body);
    },
    {
      body: vehicleRequest,
    }
  )
  .get(
    "/vehicles/:id",
    ({ params: { id } }) => {
      return service.getVehicleDetails(id);
    },
    {
      body: vehicleRequest,
    }
  )
  .patch("/vehicles/:id", ({ params }) => {
    const { id } = params;
    return service.markVehicleAsSold(id);
  })
  .get("/", () => "Hello Elysia")
  .listen(3000);



console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
