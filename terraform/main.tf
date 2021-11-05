terraform {
    required_providers {
        google = {
            source  = "hashicorp/google"
            version = "3.5.0"
        }
    }
}

provider "google" {
    credentials = file("GCPAccount.json")
    project     = "modified-return-331008"
    region      = "europe-north1"
}

resource "google_sql_database_instance" "instance" {
    name             = "sep6-sqlserver"
    region           = "europe-north1"
    database_version = "MYSQL_8_0"

    settings {
        tier = "db-f1-micro"
        ip_configuration {
        ipv4_enabled = true
            authorized_networks {
                value           = "0.0.0.0/0"
                name            = "public"
                expiration_time = "2023-11-15T16:19:00.094Z"
            }
        }
    }
}

resource "google_sql_database" "database" {
    name     = "MovieDB"
    instance = google_sql_database_instance.instance.name
}

resource "google_sql_user" "users" {
    name     = "me"
    instance = google_sql_database_instance.instance.name
    host     = "%"
    password = var.userPassword
}