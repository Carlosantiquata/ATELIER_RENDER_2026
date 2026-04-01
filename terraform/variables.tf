variable "render_api_key" {
  description = "Clé API Render"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Owner ID Render"
  type        = string
}

variable "database_url" {
  description = "URL de connexion PostgreSQL"
  type        = string
  sensitive   = true
}

variable "image_url" {
  description = "URL de l'image Docker (injectée par la CI)"
  type        = string
}

variable "image_tag" {
  description = "Tag de l'image Docker (injectée par la CI)"
  type        = string
}

variable "github_actor" {
  description = "GitHub username"
  type        = string
}
