from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .utils import import_products_from_excel


class UploadExcelView(APIView):
    """
    Excelファイルを受け取り、DBに登録 or 廃盤処理を行う
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "ファイルが選択されていません。"}, status=400)

        mark = request.data.get('mark_discontinued', 'false').lower() == 'true'
        summary = import_products_from_excel(file, mark)
        return Response(summary)


class ProductListView(generics.ListAPIView):
    """
    商品リストの取得。カテゴリ・商品名検索可能。
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.select_related('category', 'supplier')
        q = self.request.query_params.get('q')
        cat = self.request.query_params.get('category')
        if q:
            qs = qs.filter(name__icontains=q)
        if cat:
            qs = qs.filter(category__name=cat)
        return qs.order_by('product_code')


class CategoryListView(generics.ListAPIView):
    """
    カテゴリ一覧を取得（プルダウン用）
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(product__isnull=False).distinct()


# 商品削除API
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({"deleted": True}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
