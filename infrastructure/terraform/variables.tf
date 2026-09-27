variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Existing Azure Resource Group"
  type        = string
}

variable "vnet_address_space" {
  description = "VNet address space"
  type        = list(string)
}

variable "app_subnet_address_prefix" {
  description = "Subnet for App Service VNet integration"
  type        = list(string)
}

variable "private_endpoint_subnet_address_prefix" {
  description = "Subnet for Private Endpoints"
  type        = list(string)
}

variable "apim_subnet_address_prefix" {
  description = "Subnet for APIM VNet integration"
  type        = list(string)
}

variable "sql_admin_username" {
  description = "SQL administrator username"
  type        = string
  sensitive   = true
}