FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod ./

RUN go mod download
COPY . .

RUN go build -o urler-server .

EXPOSE 7956

CMD ["./urler-server"]
