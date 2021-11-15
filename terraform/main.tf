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
    project     = var.project
    region      = var.region
}

resource "google_sql_database_instance" "instance" {
    name             = "sep6-sqlserver"
    region           = var.region
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

// Do cloud build and use dockerfile
// Do cloud run to run the image created on cloud biold

//Can create the thing but for some reason cant link it to github
resource "google_cloudbuild_trigger" "build_trigger" {
    name = "sep6-backend-build"
    project     = var.project
    tags = ["gcp-cloud-build-deploy-cloud-run", "gcp-cloud-build-deploy-cloud-run-managed", "sep6-back-end"]
    
    trigger_template {
        branch_name = "^develop$"
        project_id  = var.project
        repo_name   = var.backend_repo
    }

    build {
        images = ["gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend"]

        //Build the source code with docker
        step {
            name = "gcr.io/cloud-builders/docker"
            args = ["build", "-t", "gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend", "-f", "Dockerfile"]
        }

        //Push the image
        step {
            name = "gcr.io/cloud-builders/docker"
            args = ["push", "gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend"]
        }

        //Deploy the 
        step {
            name = "gcr.io/google.com/cloudsdktool/cloud-sdk:slim"
            entrypoint = "gcloud"
            args = ["run", "deploy", "SERVICE-NAME", "--image", "gcr.io/PROJECT_ID/IMAGE", "--region", var.region, "--platform", "managed"]
            args = ["run", "services", "update", "SERVICE-NAME", "--platform=managed", "--image=gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend", "--image", "gcr.io/PROJECT_ID/IMAGE", "--region", var.region, ]
        }
    }
}

# resource "google_cloud_run_service" "default" {
#     name     = "cloudrun-backend"
#     location = "europe-north1"

#     template {
#         spec {
#             containers {
#                 image = "gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend"
#             }
#         }
#     }

#     traffic {
#         percent         = 100
#         latest_revision = true
#     }
# }