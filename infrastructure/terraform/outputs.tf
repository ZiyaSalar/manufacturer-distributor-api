output "resource_group_name" {
  value = data.azurerm_resource_group.main.name
}

output "resource_group_location" {
  value = data.azurerm_resource_group.main.location
}

output "vnet_name" {
  value = azurerm_virtual_network.main.name
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "blob_container_name" {
  value = azurerm_storage_container.product_documents.name
}

output "sql_server_name" {
  value = azurerm_mssql_server.main.name
}

output "sql_database_name" {
  value = azurerm_mssql_database.main.name
}

output "product_api_hostname" {
  value = azurerm_linux_web_app.product.default_hostname
}

output "shipment_api_hostname" {
  value = azurerm_linux_web_app.shipment.default_hostname
}

output "inventory_api_hostname" {
  value = azurerm_linux_web_app.inventory.default_hostname
}

output "product_private_ip" {
  value = azurerm_private_endpoint.product.private_service_connection[0].private_ip_address
}

output "shipment_private_ip" {
  value = azurerm_private_endpoint.shipment.private_service_connection[0].private_ip_address
}

output "inventory_private_ip" {
  value = azurerm_private_endpoint.inventory.private_service_connection[0].private_ip_address
}

output "apim_gateway_url" {
  value = azurerm_api_management.main.gateway_url
}

output "application_insights_name" {
  value = azurerm_application_insights.main.name
}

output "sql_admin_username" {
  value = var.sql_admin_username
  sensitive = true
}

output "sql_admin_password" {
  value     = random_password.sql_admin.result
  sensitive = true
}

output "apim_public_ip_addresses" {
  value = azurerm_api_management.main.public_ip_addresses
}

output "frontend_default_hostname" {
  value = azurerm_static_web_app.frontend.default_host_name
}

output "frontend_deployment_token" {
  value     = azurerm_static_web_app.frontend.api_key
  sensitive = true
}

output "product_api_gateway_path" {
  value = "${azurerm_api_management.main.gateway_url}/product"
}

output "shipment_api_gateway_path" {
  value = "${azurerm_api_management.main.gateway_url}/shipment"
}

output "inventory_api_gateway_path" {
  value = "${azurerm_api_management.main.gateway_url}/inventory"
}