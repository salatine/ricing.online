provider "azurerm" {
	features {}
	subscription_id = "d8bd1f02-8f3c-497b-8104-48a24c869300"
}

resource "azurerm_resource_group" "ricing_online" {
	name = "ricingOnlineRG"
	location = "East US"
}

resource "azurerm_app_service_plan" "ricing_online_plan" {
  name                = "ricingOnlineAppServicePlan"
  location            = azurerm_resource_group.ricing_online.location
  resource_group_name = azurerm_resource_group.ricing_online.name
  reserved = true
  kind = "Linux"
  sku {
    tier = "Free"  # Plano gratuito para fins de teste
    size = "F1"    # Tamanho F1 (Free)
  }
}

resource "azurerm_app_service" "ricing_online_webapp" {
  name                = "ricingOnlineWebApp"
  location            = azurerm_resource_group.ricing_online.location
  resource_group_name = azurerm_resource_group.ricing_online.name
  app_service_plan_id = azurerm_app_service_plan.ricing_online_plan.id
  site_config {
    always_on = true
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "14"
  }
}
