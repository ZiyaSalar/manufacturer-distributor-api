resource "azurerm_virtual_network" "main" {
  name                = "${local.name_prefix}-vnet"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name

  address_space = var.vnet_address_space

  tags = local.common_tags
}


resource "azurerm_subnet" "app_integration" {
  name                 = "snet-app-integration"
  resource_group_name  = data.azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name

  address_prefixes = var.app_subnet_address_prefix

  delegation {
    name = "app-service-delegation"

    service_delegation {
      name = "Microsoft.Web/serverFarms"

      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action"
      ]
    }
  }
}


resource "azurerm_subnet" "private_endpoints" {
  name                 = "snet-private-endpoints"
  resource_group_name  = data.azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name

  address_prefixes = var.private_endpoint_subnet_address_prefix

  private_endpoint_network_policies = "Disabled"
}


resource "azurerm_subnet" "apim" {
  name                 = "snet-apim"
  resource_group_name  = data.azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name

  address_prefixes = var.apim_subnet_address_prefix

  delegation {
    name = "apim-delegation"

    service_delegation {
      name = "Microsoft.Web/serverFarms"

      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action"
      ]
    }
  }
}