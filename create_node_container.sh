# docker run -it --rm  -v $(pwd):/home -u $(id -g):$(id -u) -w /home "$@" node:17 /bin/bash
docker run -it --rm  -v $(pwd):/home -u $(id -g):$(id -u) -w /home -p 8080:8080 node:17 /bin/bash