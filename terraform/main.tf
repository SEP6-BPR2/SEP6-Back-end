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
    region      = "europe-north1"
}

# resource "google_sql_database_instance" "instance" {
#     name             = "sep6-sqlserver"
#     region           = "europe-north1"
#     database_version = "MYSQL_8_0"

#     settings {
#         tier = "db-f1-micro"
#         ip_configuration {
#         ipv4_enabled = true
#             authorized_networks {
#                 value           = "0.0.0.0/0"
#                 name            = "public"
#                 expiration_time = "2023-11-15T16:19:00.094Z"
#             }
#         }
#     }
# }

# resource "google_sql_database" "database" {
#     name     = "MovieDB"
#     instance = google_sql_database_instance.instance.name
# }

# resource "google_sql_user" "users" {
#     name     = "me"
#     instance = google_sql_database_instance.instance.name
#     host     = "%"
#     password = var.userPassword
# }

// Do cloud build and use dockerfile
// Do cloud run to run the image created on cloud biold
# resource "google_cloudbuild_trigger" "backend-trigger" {
#     name = "sep6-backend"
#     filename = "Dockerfile"

#     github {
#         owner = "SEP6-BPR2"
#         name  = "SEP6-Back-end"
#         push {
#             branch = "^develop$"
#         }
#     }

#     # build {
#     #     source = "repoSource"
#     #     step {
#     #         name = "gcr.io/cloud-builders/gsutil"
#     #         args = ["cp", "gs://mybucket/remotefile.zip", "localfile.zip"]
#     #         timeout = "120s"
#     #     }

#     #     secret {
#     #         kms_key_name = "projects/myProject/locations/global/keyRings/keyring-name/cryptoKeys/key-name"
#     #         secret_env = {
#     #             PASSWORD = "ZW5jcnlwdGVkLXBhc3N3b3JkCg=="
#     #         }
#     #     }
#     #     artifacts {
#     #         images = ["gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:$COMMIT_SHA"]
#     #         objects {
#     #             location = "gs://bucket/path/to/somewhere/"
#     #             paths = ["path"]
#     #         }
#     #     }
#     # }  
# }

# resource "google_cloudbuild_trigger" "cloud-pubsub" {
#     name = "kubernetes-engine-samples-cloud-pubsub"
#     filename = "cloud-pubsub/cloudbuild.yaml"
#     included_files = ["cloud-pubsub/**"]

#     github {
#         owner = "GoogleCloudPlatform"
#         name = "kubernetes-engine-samples"
#         push {
#             branch = "^master$"
#         }
#     }
# }

//Can create the thing but for some reason cant link it to github
resource "google_cloudbuild_trigger" "build_trigger" {
    name = "sep6-backend-build"
    project     = var.project

    trigger_template {
        branch_name = "^develop$"
        project_id  = var.project
        repo_name   = var.backend_repo
    }

    build {
        images = ["gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend"]

        step {
            name = "gcr.io/cloud-builders/docker"
            args = ["build", "-t", "gcr.io/sep6project-331917/github.com/sep6-bpr2/sep6-back-end:backend", "-f", "Dockerfile"]
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