resource "azurerm_service_plan" "api" {
  name = "${local.name_prefix}-api-plan"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  os_type  = "Linux"
  sku_name = "P1v3"

  tags = local.common_tags
}


resource "azurerm_linux_web_app" "product" {
  name = "${local.name_prefix}-product-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  public_network_access_enabled = false

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    NODE_ENV = "production"
  }

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "shipment" {
  name = "${local.name_prefix}-shipment-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  public_network_access_enabled = false

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    NODE_ENV = "production"
  }

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "inventory" {
  name = "${local.name_prefix}-inventory-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  public_network_access_enabled = false

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    NODE_ENV = "production"
  }

  tags = local.common_tags
}