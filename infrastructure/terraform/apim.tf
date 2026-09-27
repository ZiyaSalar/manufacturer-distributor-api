resource "azurerm_api_management" "main" {
  name = "${local.name_prefix}-apim"

  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name

  publisher_name  = "Manufacturer Distributor"
  publisher_email = "admin@example.com"

  sku_name = "StandardV2_1"

  public_network_access_enabled = true

  tags = local.common_tags
}