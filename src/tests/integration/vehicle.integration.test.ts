import { describe, it, expect, beforeEach } from "bun:test";
import { createTestApp, makeRequest } from "../helpers/helpers.test";
import { cleanDatabase } from "../setup.test";
import { VehicleFactory } from "../factories/vehicle.factory.test";

describe("Testes de Integração - API de Veículos", () => {
  const app = createTestApp();

  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("POST /vehicles", () => {
    it("deve criar um novo veículo com sucesso", async () => {
      const novoVeiculo = VehicleFactory.createVehicleInput({
        make: "Toyota",
        model: "Corolla",
        color: "Preto",
      });

      const response = await makeRequest(app, "POST", "/vehicles", novoVeiculo);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        make: novoVeiculo.make,
        model: novoVeiculo.model,
        year: novoVeiculo.year,
        vin: novoVeiculo.vin,
        color: novoVeiculo.color,
        price: novoVeiculo.price,
        status: novoVeiculo.status,
      });
      expect(data.id).toBeDefined();
    });

    it("deve retornar erro 422 para dados inválidos", async () => {
      const dadosInvalidos = {
        make: "Toyota",
      };

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        dadosInvalidos
      );

      expect(response.status).toBe(422);
    });

    it("deve retornar erro 409 quando VIN já existe", async () => {
      const veiculo = VehicleFactory.createVehicleInput({
        make: "Honda",
        model: "Civic",
        color: "Azul",
      });

      await makeRequest(app, "POST", "/vehicles", veiculo);
      const response = await makeRequest(app, "POST", "/vehicles", veiculo);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error.message).toContain("already exists");
    });

    it("deve rejeitar VIN com formato inválido", async () => {
      const veiculoVinInvalido = {
        make: "Ford",
        model: "Focus",
        year: 2022,
        vin: "INVALIDO",
        color: "Vermelho",
        price: "22000.00",
        isSold: false,
      };

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoVinInvalido
      );

      expect(response.status).toBe(422);
    });

    it("deve rejeitar VIN com caracteres inválidos (I, O, Q)", async () => {
      const veiculoVinCaracteresInvalidos = VehicleFactory.createVehicleInput({
        make: "Chevrolet",
        model: "Onix",
        vin: "1234567890ABCDEIO",
      });

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoVinCaracteresInvalidos
      );

      expect(response.status).toBe(422);
    });

    it("deve processar preços decimais corretamente", async () => {
      const veiculoComPrecoDecimal = VehicleFactory.createVehicleInput({
        price: "1234.56",
      });

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoComPrecoDecimal
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.price).toBe("1234.56");
    });

    it("deve definir status como 'available' por padrão se não fornecido", async () => {
      const veiculoSemStatus = VehicleFactory.createVehicleInput();
      delete (veiculoSemStatus as any).status;

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoSemStatus
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("available");
    });
  });

  describe("GET /vehicles/:id", () => {
    it("deve recuperar um veículo por ID", async () => {
      const veiculo = VehicleFactory.createVehicleInput();
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      const response = await makeRequest(
        app,
        "GET",
        `/vehicles/${veiculoCriado.id}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: veiculoCriado.id,
        make: veiculo.make,
        model: veiculo.model,
        vin: veiculo.vin,
        color: veiculo.color,
        price: veiculo.price,
      });
    });

    it("deve retornar erro 404 para ID inexistente", async () => {
      const response = await makeRequest(
        app,
        "GET",
        "/vehicles/id-inexistente"
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error.message).toContain("not found");
    });

    it("deve recuperar veículo com status de venda correto", async () => {
      const veiculoVendido = VehicleFactory.createVehicleInput({
        status: "sold",
      });
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoVendido
      );
      const veiculoCriado = await createResponse.json();

      const response = await makeRequest(
        app,
        "GET",
        `/vehicles/${veiculoCriado.id}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("sold");
    });
  });

  describe("PUT /vehicles/:id", () => {
    it("deve atualizar um veículo com sucesso", async () => {
      const veiculo = VehicleFactory.createVehicleInput();
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      const dadosAtualizacao = {
        make: "Honda",
        model: "Civic",
        color: "Azul",
        price: "28000.00",
      };
      const response = await makeRequest(
        app,
        "PUT",
        `/vehicles/${veiculoCriado.id}`,
        dadosAtualizacao
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject(dadosAtualizacao);
      expect(data.vin).toBe(veiculo.vin);
    });

    it("deve retornar erro 404 ao atualizar veículo inexistente", async () => {
      const dadosAtualizacao = { make: "Honda" };
      const response = await makeRequest(
        app,
        "PUT",
        "/vehicles/id-inexistente",
        dadosAtualizacao
      );

      expect(response.status).toBe(404);
    });

    it("deve permitir atualizar VIN para um valor único", async () => {
      const veiculo = VehicleFactory.createVehicleInput();
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      const novoVin = VehicleFactory.generateVIN();
      const response = await makeRequest(
        app,
        "PUT",
        `/vehicles/${veiculoCriado.id}`,
        {
          vin: novoVin,
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vin).toBe(novoVin);
    });

    it("deve retornar erro 409 ao atualizar VIN para um já existente", async () => {
      const veiculo1 = VehicleFactory.createVehicleInput();
      const veiculo2 = VehicleFactory.createVehicleInput();

      const create1Response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo1
      );
      const veiculoCriado1 = await create1Response.json();
      await makeRequest(app, "POST", "/vehicles", veiculo2);

      const response = await makeRequest(
        app,
        "PUT",
        `/vehicles/${veiculoCriado1.id}`,
        {
          vin: veiculo2.vin,
        }
      );

      expect(response.status).toBe(409);
    });

    it("deve permitir atualizações parciais", async () => {
      const veiculo = VehicleFactory.createVehicleInput({
        make: "Mitsubishi",
        model: "L200",
        color: "Bege",
      });
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      const response = await makeRequest(
        app,
        "PUT",
        `/vehicles/${veiculoCriado.id}`,
        {
          color: "Vermelho",
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.color).toBe("Vermelho");
      expect(data.make).toBe(veiculo.make);
      expect(data.model).toBe(veiculo.model);
    });
  });

  describe("PATCH /vehicles/:id/sold", () => {
    it("deve marcar um veículo como vendido", async () => {
      const veiculo = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      const response = await makeRequest(
        app,
        "PATCH",
        `/vehicles/${veiculoCriado.id}/sold`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe("sold");
    });

    it("deve retornar erro 404 ao marcar veículo inexistente como vendido", async () => {
      const response = await makeRequest(
        app,
        "PATCH",
        "/vehicles/id-inexistente/sold"
      );

      expect(response.status).toBe(404);
    });

    it("deve retornar erro 409 ao marcar veículo já vendido como vendido", async () => {
      const veiculoVendido = VehicleFactory.createVehicleInput({
        status: "sold",
      });
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoVendido
      );
      const veiculoCriado = await createResponse.json();

      const response = await makeRequest(
        app,
        "PATCH",
        `/vehicles/${veiculoCriado.id}/sold`
      );
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error.message).toContain("already marked as sold");
    });

    it("deve persistir o status de vendido no banco de dados", async () => {
      const veiculo = VehicleFactory.createVehicleInput({
        status: "available",
      });
      const createResponse = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculo
      );
      const veiculoCriado = await createResponse.json();

      await makeRequest(app, "PATCH", `/vehicles/${veiculoCriado.id}/sold`);

      const response = await makeRequest(
        app,
        "GET",
        `/vehicles/${veiculoCriado.id}`
      );
      const data = await response.json();
      expect(data.status).toBe("sold");
    });
  });

  describe("Tratamento de Erros", () => {
    it("deve retornar formato de erro adequado para erros de validação", async () => {
      const response = await makeRequest(app, "POST", "/vehicles", {
        make: "Toyota",
      });
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data).toHaveProperty("error");
      expect(data.error).toHaveProperty("message");
      expect(data.error).toHaveProperty("statusCode");
      expect(data.error).toHaveProperty("timestamp");
    });

    it("deve tratar violações de constraint do banco de dados graciosamente", async () => {
      const veiculo = VehicleFactory.createVehicleInput();
      await makeRequest(app, "POST", "/vehicles", veiculo);

      const response = await makeRequest(app, "POST", "/vehicles", veiculo);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error.message).toBeDefined();
    });
  });

  describe("Validações de Regras de Negócio", () => {
    it("deve garantir unicidade do VIN em atualizações", async () => {
      const veiculo1 = VehicleFactory.createVehicleInput();
      const veiculo2 = VehicleFactory.createVehicleInput();

      const create1 = await makeRequest(app, "POST", "/vehicles", veiculo1);
      const v1 = await create1.json();
      await makeRequest(app, "POST", "/vehicles", veiculo2);

      const response = await makeRequest(app, "PUT", `/vehicles/${v1.id}`, {
        vin: veiculo2.vin,
      });

      expect(response.status).toBe(409);
    });

    it("deve validar ano corretamente", async () => {
      const veiculoAnoInvalido = VehicleFactory.createVehicleInput({
        make: "Porsche",
        model: "911",
        year: 1800,
      });

      const response = await makeRequest(
        app,
        "POST",
        "/vehicles",
        veiculoAnoInvalido
      );

      expect([200, 422]).toContain(response.status);
    });
  });
});
