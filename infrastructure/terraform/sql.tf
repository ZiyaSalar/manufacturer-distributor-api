resource "random_password" "sql_admin" {
  length = 24

  special = true
}


resource "azurerm_mssql_server" "main" {
  name = "${local.name_prefix}-sql"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  version = "12.0"

  administrator_login          = var.sql_admin_username
  administrator_login_password = random_password.sql_admin.result

  minimum_tls_version = "1.2"

  public_network_access_enabled = true

  tags = local.common_tags
}


resource "azurerm_mssql_database" "main" {
  name = "${local.name_prefix}-db"

  server_id = azurerm_mssql_server.main.id

  sku_name = "S0"

  tags = local.common_tags
}