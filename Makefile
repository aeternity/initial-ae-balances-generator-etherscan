.PHONY: docker
docker:
	docker build -t aeternity/token-burn-listener-etherscan .

.PHONY:
docker-run:
	$(MAKE) docker
	printf '' > accounts.json
	printf '' > collected_logs.json
	docker run --rm -it -v $(CURDIR)/accounts.json:/usr/src/code/accounts.json -v $(CURDIR)/collected_logs.json:/usr/src/code/collected_logs.json aeternity/token-burn-listener-etherscan -k "$(ETHERSCAN_APIKEY)"
