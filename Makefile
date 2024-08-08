include .env
export $(shell sed 's/=.*//' .env)
VERSION_FILE := .version

define increment_version
	$(eval VERSION := $(shell [ -f $(VERSION_FILE) ] && cat $(VERSION_FILE) || echo "0.0.0"))
	$(eval MAJOR := $(word 1,$(subst ., ,$(VERSION))))
	$(eval MINOR := $(word 2,$(subst ., ,$(VERSION))))
	$(eval PATCH := $(word 3,$(subst ., ,$(VERSION))))
	$(eval NEW_PATCH := $(shell echo $$(($(PATCH) + 1))))
	$(eval NEW_VERSION := $(MAJOR).$(MINOR).$(NEW_PATCH))
	echo $(NEW_VERSION) > $(VERSION_FILE)
endef

build:
	@echo "Building Docker image..."
	$(call increment_version)
	docker build -t $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPO_NAME)/$(IMAGE_NAME):$(NEW_VERSION) .

push: build
	@echo "Pushing Docker image..."
	docker push $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPO_NAME)/$(IMAGE_NAME):$(NEW_VERSION)

clean:
	@echo "Cleaning up..."
	rm -f $(VERSION_FILE)
	@echo "Done!"