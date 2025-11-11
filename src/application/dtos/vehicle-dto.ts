import { t } from "elysia";

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export const CreateVehicleDTO = t.Object({
  make: t.String({
    minLength: 2,
    maxLength: 50,
    error: "Make must be between 2 and 50 characters",
  }),
  model: t.String({
    minLength: 1,
    maxLength: 100,
    error: "Model must be between 1 and 100 characters",
  }),
  year: t.Number({
    minimum: 1900,
    maximum: new Date().getFullYear() + 2,
    error: `Year must be between 1900 and ${new Date().getFullYear() + 2}`,
  }),
  vin: t.String({
    minLength: 17,
    maxLength: 17,
    pattern: VIN_REGEX.source,
    error: "VIN must be 17 characters (A-Z, 0-9, excluding I, O, Q)",
  }),
  color: t.String({
    minLength: 2,
    maxLength: 30,
    error: "Color must be between 2 and 30 characters",
  }),
  price: t.String({
    pattern: "^\\d+(\\.\\d{1,2})?$",
    error: "Price must be a valid decimal number with up to 2 decimal places",
  }),
  status: t.Optional(
    t.Union([t.Literal("available"), t.Literal("sold")], {
      error: "Status must be either 'available' or 'sold'",
    })
  ),
});

export const UpdateVehicleDTO = t.Object({
  make: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 50,
      error: "Make must be between 2 and 50 characters",
    })
  ),
  model: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 100,
      error: "Model must be between 1 and 100 characters",
    })
  ),
  year: t.Optional(
    t.Number({
      minimum: 1900,
      maximum: new Date().getFullYear() + 2,
      error: `Year must be between 1900 and ${new Date().getFullYear() + 2}`,
    })
  ),
  vin: t.Optional(
    t.String({
      minLength: 17,
      maxLength: 17,
      pattern: VIN_REGEX.source,
      error: "VIN must be 17 characters (A-Z, 0-9, excluding I, O, Q)",
    })
  ),
  color: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 30,
      error: "Color must be between 2 and 30 characters",
    })
  ),
  price: t.Optional(
    t.String({
      pattern: "^\\d+(\\.\\d{1,2})?$",
      error: "Price must be a valid decimal number with up to 2 decimal places",
    })
  ),
  status: t.Optional(
    t.Union([t.Literal("available"), t.Literal("sold")], {
      error: "Status must be either 'available' or 'sold'",
    })
  ),
});

export const VehicleResponseDTO = t.Object({
  id: t.String(),
  make: t.String(),
  model: t.String(),
  year: t.Number(),
  vin: t.String(),
  color: t.String(),
  price: t.String(),
  status: t.Union([t.Literal("available"), t.Literal("sold")]),
});

export const VehicleParamsDTO = t.Object({
  id: t.String({
    minLength: 1,
    error: "ID is required",
  }),
});

export const VehicleQueryDTO = t.Object({
  status: t.Optional(
    t.Union([t.Literal("available"), t.Literal("sold")], {
      error: "Status must be either 'available' or 'sold'",
    })
  ),
});

export const VehicleListResponseDTO = t.Array(VehicleResponseDTO);

export const VehicleWebhookDTO = t.Object({
  vehicleId: t.String({
    minLength: 1,
    error: "Vehicle ID is required",
  }),
  status: t.Union([t.Literal("available"), t.Literal("sold")], {
    error: "Status must be either 'available' or 'sold'",
  }),
});

export type CreateVehicleInput = typeof CreateVehicleDTO.static;

export type UpdateVehicleInput = typeof UpdateVehicleDTO.static;

export type VehicleResponse = typeof VehicleResponseDTO.static;

export type VehicleWebhookInput = typeof VehicleWebhookDTO.static;
